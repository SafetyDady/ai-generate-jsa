// ✅ pages/jsa/generate-builder.js (ต่อจากเดิม)
// รวมฟังก์ชัน Export Excel เชื่อม API จริง

import { useEffect, useState } from 'react';

export default function GenerateBuilder() {
  const [steps, setSteps] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [siteName, setSiteName] = useState('');
  const [areaName, setAreaName] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    const storedSteps = localStorage.getItem('draftSteps');
    if (storedSteps) {
      const stepObjects = JSON.parse(storedSteps).map((text, index) => ({
        id: index + 1,
        text,
        type: 'main',
        hazard: '',
        control: '',
        ppe: '',
        jobType: ''
      }));
      setSteps(stepObjects);
    }
  }, []);

  const handleAddJobType = () => {
    const label = prompt('ใส่ชื่อ Job Type ใหม่:');
    if (label) setJobTypes([...jobTypes, label]);
  };

  const handleUpdate = (id, field, value) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleGenerateGSA = async () => {
    setLoading(true);
    const updated = [...steps];

    for (let i = 0; i < updated.length; i++) {
      const step = updated[i];
      try {
        const res = await fetch('/api/generate-gsa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepText: step.text })
        });
        const data = await res.json();
        updated[i].hazard = data.hazard || '';
        updated[i].control = data.control || '';
        updated[i].ppe = data.ppe || '';
      } catch (err) {
        console.error('❌ Failed on step', i, err);
      }
    }

    setSteps(updated);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!siteName || !areaName || !jobTitle) {
      alert('กรุณากรอก Site Name, Area Name และ Job Title');
      return;
    }

    try {
      const res = await fetch('/api/save-jsa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteName, areaName, jobTitle, steps })
      });
      const data = await res.json();
      alert(data.message || '✅ บันทึกสำเร็จ');
    } catch (err) {
      alert('❌ เกิดข้อผิดพลาดในการบันทึก');
      console.error(err);
    }
  };

  const handleExport = async () => {
    if (!siteName || !areaName || !jobTitle) {
      alert('กรุณากรอก Site Name, Area Name และ Job Title');
      return;
    }

    try {
      const res = await fetch('/api/export-jsa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteName, areaName, jobTitle, steps })
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'jsa-export.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('❌ Export ไม่สำเร็จ');
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold text-center">🧩 Draft JSA Builder</h1>

      {/* Header Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Site Name"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Area Name"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </div>

      <div className="flex gap-3 items-center">
        <label className="font-semibold">🎯 Job Types:</label>
        {jobTypes.map((j, i) => (
          <span key={i} className="bg-gray-200 px-3 py-1 rounded text-sm">{j}</span>
        ))}
        <button
          className="px-3 py-1 bg-green-600 text-white rounded text-sm"
          onClick={handleAddJobType}
        >+ Add Job Type</button>
      </div>

      <div className="border rounded overflow-hidden">
        <div className="grid grid-cols-6 bg-gray-100 text-sm font-semibold px-3 py-2">
          <div>Step</div>
          <div>Job Type</div>
          <div>Type</div>
          <div>Hazard</div>
          <div>Control</div>
          <div>PPE</div>
        </div>

        {steps.map(step => (
          <div key={step.id} className="grid grid-cols-6 gap-2 px-3 py-2 border-t text-sm">
            <div>{step.text}</div>

            <select
              className="border p-1"
              value={step.jobType}
              onChange={e => handleUpdate(step.id, 'jobType', e.target.value)}
            >
              <option value="">เลือก</option>
              {jobTypes.map((j, i) => <option key={i} value={j}>{j}</option>)}
            </select>

            <select
              className="border p-1"
              value={step.type}
              onChange={e => handleUpdate(step.id, 'type', e.target.value)}
            >
              <option value="main">Main</option>
              <option value="sub">Sub</option>
            </select>

            <input
              className="border p-1"
              value={step.hazard}
              onChange={e => handleUpdate(step.id, 'hazard', e.target.value)}
              placeholder="Hazard"
            />
            <input
              className="border p-1"
              value={step.control}
              onChange={e => handleUpdate(step.id, 'control', e.target.value)}
              placeholder="Control"
            />
            <input
              className="border p-1"
              value={step.ppe}
              onChange={e => handleUpdate(step.id, 'ppe', e.target.value)}
              placeholder="PPE"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={handleGenerateGSA}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white font-bold rounded"
        >
          {loading ? '⏳ Generating with AI...' : '⚡ Generate GSA by AI'}
        </button>

        <button onClick={handleSave} className="px-4 py-2 bg-gray-700 text-white rounded">💾 Save JSA</button>
        <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded">📄 Export Excel</button>
      </div>
    </div>
  );
}
