"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sanitizeInput } from "@/lib/utils";
import type { PaginatedResponse, User } from "@/types";

export async function getUsers(params: {
  query?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<User>> {
  const { query = "", page = 1, pageSize = 10 } = params;

  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
  }

  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        photo: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users as User[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getUserById(userId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        photo: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    return { success: true, data: user };
  } catch {
    return { success: false, error: "Failed to fetch user." };
  }
}

export async function updateProfile(formData: { name: string }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Unauthorized" };
    }

    const sanitizedName = sanitizeInput(formData.name);

    if (sanitizedName.length < 2) {
      return { success: false, error: "Name must be at least 2 characters." };
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { name: sanitizedName },
    });

    return { success: true, message: "Profile updated successfully!" };
  } catch {
    return { success: false, error: "Failed to update profile." };
  }
}
