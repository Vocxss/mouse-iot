import admin from "firebase-admin"

import serviceAccount from "./adalah-pokoknya-56795-firebase-adminsdk-fbsvc-369fd10cf8.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://adalah-pokoknya-56795-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
}

export const authAdmin = admin.auth()