import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

import generate from './routes/generateJSA.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Firebase Admin Init
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

export const db = admin.firestore();

// ✅ Routes
app.use('/api/generate', generate);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ JSA Backend API running on port ${PORT}`);
});
