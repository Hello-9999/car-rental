import * as admin from "firebase-admin";
import path from "path";

// Ensure the service account key is properly required
const serviceAccount = require(path.resolve(
  __dirname,
  "data/car-rental-web-app-369ff-firebase-adminsdk-fbsvc-5ac508d5ce.json"
));

console.log(serviceAccount, "serviceAccount");

// Initialize Firebase Admin SDK with the service account credentials
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.app(); // If already initialized, use the default app
}
