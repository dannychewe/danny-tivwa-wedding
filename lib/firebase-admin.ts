import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

type FirebaseServiceAccount = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

function cleanEnvValue(value?: string) {
  return value?.trim().replace(/^["']|["']$/g, "");
}

function normalizePrivateKey(value?: string) {
  return cleanEnvValue(value)
    ?.replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");
}

function getServiceAccountFromJson() {
  const serviceAccountJson = cleanEnvValue(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  );

  if (!serviceAccountJson) {
    return null;
  }

  try {
    return JSON.parse(serviceAccountJson) as FirebaseServiceAccount;
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.");
  }
}

function getMissingFirebaseValues(values: Record<string, string | undefined>) {
  return Object.entries(values)
    .filter(([, value]) => !value)
    .map(([name]) => name);
}

export function getAdminDb() {
  if (!getApps().length) {
    const serviceAccount = getServiceAccountFromJson();
    const projectId = cleanEnvValue(
      serviceAccount?.project_id ||
      process.env.FIREBASE_PROJECT_ID ||
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    );
    const clientEmail = cleanEnvValue(
      serviceAccount?.client_email || process.env.FIREBASE_CLIENT_EMAIL
    );
    const privateKey = normalizePrivateKey(
      serviceAccount?.private_key || process.env.FIREBASE_PRIVATE_KEY
    );
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
