"use server";

import { hashPassword, verifyPassword, createSession, destroySession, getCurrentUser } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations";
import { authRateLimiter, loginFailureLimiter, recordLoginFailure, clearLoginFailures } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/utils";

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export async function register(formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const prisma = await getPrisma();

    const failureCheck = loginFailureLimiter(formData.email);
    if (!failureCheck.success) {
      return { success: false, error: `Too many failed attempts. Try again in ${failureCheck.resetInSec} seconds.`, lockoutSeconds: failureCheck.resetInSec };
    }

    const validated = registerSchema.safeParse(formData);
    if (!validated.success) {
      recordLoginFailure(formData.email);
      const postFailCheck = loginFailureLimiter(formData.email);
      return { success: false, error: validated.error.issues[0].message, lockoutSeconds: !postFailCheck.success ? postFailCheck.resetInSec : 0 };
    }

    const { name, email, password } = validated.data;
    const sanitizedName = sanitizeInput(name);

    const rateCheck = authRateLimiter(email);
    if (!rateCheck.success) {
      return { success: false, error: "Too many attempts. Please try again later." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      recordLoginFailure(email);
      const postFailCheck = loginFailureLimiter(email);
      return { success: false, error: "An account with this email already exists.", lockoutSeconds: !postFailCheck.success ? postFailCheck.resetInSec : 0 };
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    await createSession(user.id);
    clearLoginFailures(email);

    return { success: true, message: "Account created successfully!" };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function login(formData: { email: string; password: string }) {
  try {
    const prisma = await getPrisma();

    const validated = loginSchema.safeParse(formData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { email, password } = validated.data;

    const failureCheck = loginFailureLimiter(email);
    if (!failureCheck.success) {
      return { success: false, error: `Too many wrong password attempts. Try again in ${failureCheck.resetInSec} seconds.`, lockoutSeconds: failureCheck.resetInSec };
    }

    const rateCheck = authRateLimiter(email);
    if (!rateCheck.success) {
      return { success: false, error: "Too many login attempts. Please try again later." };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      recordLoginFailure(email);
      const postFailCheck = loginFailureLimiter(email);
      return { success: false, error: "Invalid email or password.", lockoutSeconds: !postFailCheck.success ? postFailCheck.resetInSec : 0 };
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      recordLoginFailure(email);
      const postFailCheck = loginFailureLimiter(email);
      return { success: false, error: "Invalid email or password.", lockoutSeconds: !postFailCheck.success ? postFailCheck.resetInSec : 0 };
    }

    clearLoginFailures(email);

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    await createSession(user.id);

    return {
      success: true,
      message: "Login successful!",
      role: user.role,
    };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function googleLogin(data: {
  name: string;
  email: string;
  photo: string | null;
  firebaseUid: string;
}) {
  try {
    const prisma = await getPrisma();

    const { name, email, photo, firebaseUid } = data;

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      user = await prisma.user.update({
        where: { email },
        data: {
          name: name || user.name,
          photo: photo || user.photo,
          firebaseUid: firebaseUid || user.firebaseUid,
          lastLogin: new Date(),
          emailVerified: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: sanitizeInput(name),
          email,
          photo,
          firebaseUid,
          role: "USER",
          emailVerified: true,
          lastLogin: new Date(),
        },
      });

      await prisma.account.create({
        data: {
          userId: user.id,
          provider: "google",
          providerAccountId: firebaseUid,
        },
      });
    }

    await createSession(user.id);

    return {
      success: true,
      message: "Login successful!",
      role: user.role,
    };
  } catch {
    return { success: false, error: "Something went wrong with Google login." };
  }
}

export async function logout() {
  try {
    await destroySession();
    return { success: true, message: "Logged out successfully." };
  } catch {
    return { success: false, error: "Failed to logout." };
  }
}

export async function forgotPassword(formData: { email: string }) {
  try {
    const prisma = await getPrisma();

    const user = await prisma.user.findUnique({
      where: { email: formData.email.toLowerCase().trim() },
    });

    if (!user) {
      return { success: true, message: "If an account exists, a reset link has been sent." };
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        email: formData.email.toLowerCase().trim(),
        token,
        expiresAt,
      },
    });

    console.log(`Password reset token for ${formData.email}: ${token}`);

    return { success: true, message: "If an account exists, a reset link has been sent." };
  } catch {
    return { success: false, error: "Something went wrong." };
  }
}

export async function changePasswordAction(formData: {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) {
  try {
    const prisma = await getPrisma();
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Password change failed." };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || !dbUser.password) {
      return { success: false, error: "Password change failed." };
    }

    const { oldPassword, newPassword, confirmNewPassword } = formData;

    if (newPassword !== confirmNewPassword) {
      return { success: false, error: "Password change failed." };
    }

    if (newPassword.length < 8) {
      return { success: false, error: "Password change failed." };
    }

    const isValid = await verifyPassword(oldPassword, dbUser.password);
    if (!isValid) {
      return { success: false, error: "Password change failed." };
    }

    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return { success: true, message: "Password changed successfully" };
  } catch {
    return { success: false, error: "Password change failed." };
  }
}
