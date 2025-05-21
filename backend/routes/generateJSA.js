// backend/routes/generateJSA.js
import express from "express";
import OpenAI from "openai";

const router = express.Router();
const USE_MOCK = false;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 📌 Prompt ใหม่ที่แม่นยำ
const createPrompt = (step) => {
  return `
คุณคือผู้เชี่ยวชาญด้านความปลอดภัยในงานก่อสร้าง

กรุณาตอบกลับโดยใช้รูปแบบนี้เท่านั้น:
Hazard: [เขียนเฉพาะรายการอันตราย]
Control: [เขียนเฉพาะวิธีควบคุม]
PPE: [เขียนเฉพาะอุปกรณ์ป้องกันภัยส่วนบุคคล]

Main Step: ${step.mainStep || "ไม่ระบุ"}
Sub Step: ${step.subStep || "ไม่ระบุ"}
`;
};

function extract(text, label) {
  const regex = new RegExp(`${label}\\s*[:：]([^\\n]*)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

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
        hazards: [{
          hazard: "ตัวอย่างอันตราย",
          control: "วิธีควบคุมตัวอย่าง",
          ppe: "หมวกนิรภัย, ถุงมือ",
        }],
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

        const aiText = chat.choices[0].message.content || "";

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
        console.error("❌ OpenAI Error:", err.message);
        results.push({
          mainStep: step.mainStep,
          hazards: [{ hazard: "Error", control: "Error", ppe: "Error" }],
        });
      }
    }
  }

  res.json({ success: true, data: results });
});

export default router;
