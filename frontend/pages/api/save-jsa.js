// ✅ pages/api/save-jsa.js
import { dbAdmin as db } from '@/lib/firebase-admin-config';
import { serverTimestamp } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { siteName, areaName, jobTitle, steps } = req.body;

  try {
    await db.collection('jsa_records').add({
      siteName,
      areaName,
      jobTitle,
      steps,
      createdAt: serverTimestamp()
    });

    res.status(200).json({ message: '✅ บันทึก JSA เรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Save JSA error:', error);
    res.status(500).json({ error: '❌ ไม่สามารถบันทึก JSA ได้' });
  }
}

