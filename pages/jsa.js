// pages/jsa.js

import { useState } from 'react';

export default function JSA() {
  const [steps, setSteps] = useState([
    {
      mainStep: '',
      subSteps: [],
      hazards: [{ hazard: '', control: '', ppe: '' }],
    },
  ]);

  const [generatedSteps, setGeneratedSteps] = useState([]); // ✅ แสดงผลลัพธ์จาก backend

  const addStep = () => {
    setSteps([
      ...steps,
      {
        mainStep: '',
        subSteps: [],
        hazards: [{ hazard: '', control: '', ppe: '' }],
      },
    ]);
  };

  const updateHazardField = (stepIndex, hazardIndex, field, value) => {
    const newSteps = [...steps];
    newSteps[stepIndex].hazards[hazardIndex][field] = value;
    setSteps(newSteps);
  };

  const addHazard = (stepIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].hazards.push({ hazard: '', control: '', ppe: '' });
    setSteps(newSteps);
  };

  const removeHazard = (stepIndex, hazardIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].hazards.splice(hazardIndex, 1);
    setSteps(newSteps);
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps }),
      });

      const result = await res.json();
      console.log("✅ Response from backend:", result);
      if (result.success) {
        setGeneratedSteps(result.data);
      }
    } catch (err) {
      console.error("❌ Error calling API:", err);
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📄 JSA Autogen Project – Hazard / Control / PPE</h1>

      {steps.map((step, stepIndex) => (
        <div key={stepIndex} className="mb-8 border-b pb-6">
          <div className="mb-2">
            <label className="font-semibold">Main Step {stepIndex + 1}</label>
            <input
              type="text"
              className="w-full border p-2 mt-1"
              value={step.mainStep}
              onChange={(e) => {
                const newSteps = [...steps];
                newSteps[stepIndex].mainStep = e.target.value;
                setSteps(newSteps);
              }}
            />
          </div>

          {step.hazards.map((hazard, hazardIndex) => (
            <div key={hazardIndex} className="grid grid-cols-3 gap-4 mt-4 items-start">
              <input
                className="border p-2"
                placeholder="Hazard"
                value={hazard.hazard}
                onChange={(e) =>
                  updateHazardField(stepIndex, hazardIndex, 'hazard', e.target.value)
                }
              />
              <input
                className="border p-2"
                placeholder="Control (comma-separated)"
                value={hazard.control}
                onChange={(e) =>
                  updateHazardField(stepIndex, hazardIndex, 'control', e.target.value)
                }
              />
              <input
                className="border p-2"
                placeholder="PPE (comma-separated)"
                value={hazard.ppe}
                onChange={(e) =>
                  updateHazardField(stepIndex, hazardIndex, 'ppe', e.target.value)
                }
              />
              <button
                className="text-red-500 text-sm mt-2"
                onClick={() => removeHazard(stepIndex, hazardIndex)}
              >
                − Remove
              </button>
            </div>
          ))}

          <button
            className="text-blue-500 mt-3 text-sm"
            onClick={() => addHazard(stepIndex)}
          >
            + Add Hazard
          </button>
        </div>
      ))}

      <button
        className="bg-gray-800 text-white px-6 py-2 rounded mr-4"
        onClick={addStep}
      >
        + Add Row
      </button>

      <button
        className="bg-green-600 text-white px-6 py-2 rounded"
        onClick={handleSubmit}
      >
        ✅ CONFIRM JSA
      </button>

      {generatedSteps.length > 0 && (
        <div className="mt-10 bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-bold mb-4">📌 Generated Results</h2>
          {generatedSteps.map((step, index) => (
            <div key={index} className="mb-6">
              <p className="font-semibold mb-2">Main Step {index + 1}: {step.mainStep}</p>
              {step.hazards.map((hz, i) => (
                <div key={i} className="ml-4 mb-2">
                  • <span className="font-medium">Hazard:</span> {hz.hazard}<br />
                  → <span className="font-medium">Control:</span> {hz.control}<br />
                  → <span className="font-medium">PPE:</span> {hz.ppe}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
