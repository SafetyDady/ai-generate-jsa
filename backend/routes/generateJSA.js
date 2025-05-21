// backend/routes/generateJSA.js
import express from "express";
import OpenAI from "openai";

const router = express.Router();
const USE_MOCK = false;

// ✅ ใช้ OpenAI รุ่น gpt-3.5-turbo
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 ฟังก์ชันสร้าง Prompt
const createPrompt = (step) => {
  return `
คุณคือผู้เชี่ยวชาญด้านความปลอดภัยในการทำงาน จงวิเคราะห์ขั้นตอนงานนี้และตอบกลับในรูปแบบ JSON โดยไม่มีคำอธิบายใด ๆ เพิ่มเติม

Main Step: ${step.mainStep || "ไม่ระบุ"}
Sub Step: ${step.subStep || "ไม่ระบุ"}

รูปแบบ JSON ที่ต้องการ:
{
  "hazard": "...",
  "control": "...",
  "ppe": "..." // ระบุ PPE เพียง 1 รายการที่เหมาะสมที่สุดเท่านั้น
}
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
            ppe: "หมวกนิรภัย",
          },
        ],
      });
    } else {
      try {
        const chat = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "คุณคือผู้ช่วยความปลอดภัยในโรงงาน" },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        });

        const aiText = chat.choices[0].message.content;

        const parsed = extractJSON(aiText);

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

// 📦 ฟังก์ชันดึง JSON อัตโนมัติจากข้อความ
function extractJSON(text) {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;
    const jsonText = text.slice(start, end);
    return JSON.parse(jsonText);
  } catch (e) {
    return { hazard: "", control: "", ppe: "" };
  }
}

export default router;
