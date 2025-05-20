// File: jsautogen/backend/firebase-admin.js

const admin = require('firebase-admin');

// ❗ ต้องดาวน์โหลดไฟล์จาก Firebase Console แล้ววางไว้ตาม path นี้
const serviceAccount = require("C:/Users/sanch/Desktop/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "jsa-auto-generate.appspot.com",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
