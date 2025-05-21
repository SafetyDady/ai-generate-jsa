import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

import saveJSA from './routes/saveJSA.js';
import exportJSA from './routes/exportJSA.js';

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

// ✅ Firestore Instance Export
export const db = admin.firestore();

// ✅ Routes
app.use('/api/save-jsa', saveJSA);
app.use('/api/export-jsa', exportJSA);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ JSA Backend API running on port ${PORT}`);
});
