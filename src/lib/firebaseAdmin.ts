import admin from "firebase-admin";

let serviceAccount: any;

if (process.env.NEXT_PUBLIC_PROJECT_ID || process.env.FIREBASE_PROJECT_ID) {
  serviceAccount = {
    type:
      process.env.FIREBASE_TYPE ||
      process.env.NEXT_PUBLIC_TYPE ||
      "service_account",
    project_id:
      process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_PROJECT_ID,
    private_key_id:
      process.env.FIREBASE_PRIVATE_KEY_ID ||
      process.env.NEXT_PUBLIC_PRIVATE_KEY_ID,
    private_key: (
      process.env.FIREBASE_PRIVATE_KEY || process.env.NEXT_PUBLIC_PRIVATE_KEY
    )?.replace(/\\n/g, "\n"),
    client_email:
      process.env.FIREBASE_CLIENT_EMAIL || process.env.NEXT_PUBLIC_CLIENT_EMAIL,
    client_id:
      process.env.FIREBASE_CLIENT_ID || process.env.NEXT_PUBLIC_CLIENT_ID,
    auth_uri:
      process.env.FIREBASE_AUTH_URI ||
      process.env.NEXT_PUBLIC_AUTH_URI ||
      "https://accounts.google.com/o/oauth2/auth",
    token_uri:
      process.env.FIREBASE_TOKEN_URI ||
      process.env.NEXT_PUBLIC_TOKEN_URI ||
      "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL ||
      process.env.NEXT_PUBLIC_AUTH_PROVIDER_X509_CERT_URL ||
      "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      process.env.FIREBASE_CLIENT_X509_CERT_URL ||
      process.env.NEXT_PUBLIC_CLIENT_X509_CERT_URL,
    universe_domain:
      process.env.FIREBASE_UNIVERSE_DOMAIN ||
      process.env.NEXT_PUBLIC_UNIVERSE_DOMAIN ||
      "googleapis.com",
  };
} else {
  try {
    serviceAccount = require("./adalah-pokoknya-56795-firebase-adminsdk-fbsvc-369fd10cf8.json");
  } catch (error) {
    console.warn(
      "Firebase admin service account could not be loaded locally.",
      error,
    );
  }
}

if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL:
      process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
      "https://adalah-pokoknya-56795-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

export const authAdmin = admin.auth();
