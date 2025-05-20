// backend/routes/generate.js
import express from "express";
import OpenAI from "openai";

const router = express.Router();
const USE_MOCK = false;

// ✅ ใช้ OpenAI v4
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 Function สร้าง Prompt จาก Step
const createPrompt = (step) => {
  return `
คุณคือผู้เชี่ยวชาญด้านความปลอดภัย จงวิเคราะห์ขั้นตอนงานและสร้างรายการ:
1. อันตรายที่อาจเกิดขึ้น (Hazard)
2. วิธีควบคุม (Control)
3. อุปกรณ์ป้องกันภัยส่วนบุคคล (PPE)

Main Step: ${step.mainStep || "ไม่ระบุ"}
Sub Step: ${step.subStep || "ไม่ระบุ"}
`;
};

// ✅ Route: POST /api/generate
router.post("/", async (req, res) => {
  const { steps } = req.body;

  if (!steps || !Array.isArray(steps)) {
    return res.status(400).json({ success: false, message: "Missing steps[]" });
  }

  const results = [];

  for (const step of steps) {
    const prompt = createPrompt(step);

    if (USE_MOCK) {
      results.push({
        mainStep: step.mainStep,
        hazards: [
          {
            hazard: "ตัวอย่างอันตราย",
            control: "ตัวอย่างวิธีควบคุม",
            ppe: "หมวกนิรภัย, รองเท้ากันลื่น",
          },
        ],
      });
    } else {
      try {
        const chat = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: "คุณคือผู้ช่วยความปลอดภัยในโรงงาน" },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        });

        const aiText = chat.choices[0].message.content;

        const parsed = {
          hazard: extract(aiText, "Hazard"),
          control: extract(aiText, "Control"),
          ppe: extract(aiText, "PPE"),
        };

        results.push({
          mainStep: step.mainStep,
          hazards: [parsed],
        });
      } catch (err) {
        console.error("❌ OpenAI error:", err.message);
        results.push({
          mainStep: step.mainStep,
          hazards: [{ hazard: "Error", control: "Error", ppe: "Error" }],
        });
      }
    }
  }

  res.json({ success: true, data: results });
});

// 🔍 ฟังก์ชันช่วยแยกข้อความ Hazard, Control, PPE
function extract(text, label) {
  const regex = new RegExp(`${label}\\s*[:：]([^\\n]*)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

export default router;
