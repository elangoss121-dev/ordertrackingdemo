import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const hasAdminConfig = 
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

if (!getApps().length) {
  if (hasAdminConfig) {
    const firebaseAdminConfig: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    };

    initializeApp({
      credential: cert(firebaseAdminConfig),
    });
  } else {
    // Minimal mock fallback for static build step
    initializeApp({
      projectId: "mock-project-id",
    });
  }
}

export const adminAuth = getAuth();
