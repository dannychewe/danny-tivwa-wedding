import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function cleanEnvValue(value?: string) {
  return value?.trim().replace(/^["']|["']$/g, "");
}

function getPrivateKey() {
  return cleanEnvValue(process.env.FIREBASE_PRIVATE_KEY)
    ?.replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");
}

function getMissingFirebaseValues(values: Record<string, string | undefined>) {
  return Object.entries(values)
    .filter(([, value]) => !value)
    .map(([name]) => name);
}

export function getAdminDb() {
  if (!getApps().length) {
    const projectId = cleanEnvValue(
      process.env.FIREBASE_PROJECT_ID ||
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    );
    const clientEmail = cleanEnvValue(process.env.FIREBASE_CLIENT_EMAIL);
    const privateKey = getPrivateKey();
    const missingValues = getMissingFirebaseValues({
      FIREBASE_PROJECT_ID: projectId,
      FIREBASE_CLIENT_EMAIL: clientEmail,
      FIREBASE_PRIVATE_KEY: privateKey
    });

    if (missingValues.length === 0) {
      initializeApp({
        credential: cert({
          projectId: projectId!,
          clientEmail: clientEmail!,
          privateKey: privateKey!
        })
      });
    } else {
      if (process.env.VERCEL) {
        throw new Error(
          `Missing Firebase Admin environment values: ${missingValues.join(", ")}`
        );
      }

      initializeApp({
        projectId
      });
    }
  }

  return getFirestore();
}
