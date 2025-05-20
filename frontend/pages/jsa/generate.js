// ✅ pages/jsa/generate-upload.js
// Phase 1: Upload Workstep + Extract AI Draft

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function GenerateUpload() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [siteName, setSiteName] = useState('');
  const [area, setArea] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleExtract = async () => {
    if (!file || !siteName || !area || !jobTitle) {
      alert('กรุณากรอกข้อมูลให้ครบและเลือกไฟล์');
      return;
    }

    setUploading(true);

    // ⛳️ Mock AI Extraction Result
    const mockExtractedSteps = [
      'ปีนบันไดขึ้นไปยังตำแหน่งติดตั้ง',
      'ยึดโครงโคมไฟเข้ากับผนัง',
      'เดินสายไฟจากโคมไปยังปลั๊ก',
      'ทดสอบการทำงานของไฟ'
    ];

    // ✅ ส่งค่าไป Phase 2 ผ่าน query หรือ storage
    localStorage.setItem('draftSteps', JSON.stringify(mockExtractedSteps));
    router.push('/jsa/generate-builder');
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-center">📤 Upload Workstep File for Draft JSA</h1>

      <div className="space-y-3">
        <input
          type="file"
          accept=".docx,.txt,.xlsx"
          onChange={handleFileChange}
          className="border rounded p-2 w-full"
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Site Name"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Area Name"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white font-bold py-2 rounded"
          onClick={handleExtract}
          disabled={uploading}
        >
          {uploading ? '⏳ กำลังประมวลผล...' : '📎 Extract Work Steps'}
        </button>
      </div>
    </div>
  );
}
