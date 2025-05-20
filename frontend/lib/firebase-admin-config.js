// lib/firebase-admin-config.js
import admin from "firebase-admin";

// ✅ ใช้ initializeApp แค่ครั้งเดียวเท่านั้น
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // สำหรับใช้งานใน local / dev
  });
}

// ✅ Export Firestore instance ของ Firebase Admin
const dbAdmin = admin.firestore();

export { dbAdmin };

