"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { googleLogin } from "@/actions/auth";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useCurrentUser();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      if (!firebaseUser.email) {
        toast.error("Google sign in failed: Email not provided.");
        return;
      }

      const res = await googleLogin({
        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        email: firebaseUser.email,
        photo: firebaseUser.photoURL,
        firebaseUid: firebaseUser.uid,
      });

      if (res.success) {
        toast.success(res.message);
        await refreshUser();
        if (res.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(res.error || "Authentication failed");
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-in cancelled.");
      } else {
        toast.error(error.message || "An error occurred during Google sign-in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center space-x-2 rounded-xl h-11 transition-all active:scale-[0.98]"
    >
      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
        <path
          fill="#EA4335"
          d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.09 14.99 0 12 0 7.354 0 3.307 2.67.653 6.56l4.613 3.205z"
        />
        <path
          fill="#34A853"
          d="M16.04 15.358c-1.045.718-2.4 1.15-4.04 1.15a7.078 7.078 0 0 1-6.734-4.856L.653 14.857C3.307 18.75 7.354 21.42 12 21.42c2.93 0 5.823-1.068 7.91-2.996l-3.87-3.066z"
        />
        <path
          fill="#4285F4"
          d="M23.49 12.275c0-.8-.065-1.57-.197-2.316H12v4.51h6.47a5.53 5.53 0 0 1-2.43 3.633l3.87 3.066c2.263-2.09 3.58-5.168 3.58-8.893z"
        />
        <path
          fill="#FBBC05"
          d="M5.266 11.654a7.077 7.077 0 0 1 0-1.89L.653 6.56A11.95 11.95 0 0 0 0 12c0 1.92.455 3.733 1.258 5.34l4.008-3.686z"
        />
      </svg>
      {loading ? "Connecting Google..." : "Continue with Google"}
    </Button>
  );
}
