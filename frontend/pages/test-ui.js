import { useState } from "react";

export default function TestUI() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    jobType: "งานไฟฟ้า",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📦 ข้อมูลที่ส่ง:", formData);
    alert("✅ บันทึกแล้ว (mock)");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        🧪 Test UI - JSA Autogen
      </h1>

      <form onSubmit={handleSubmit}>
        <label>ชื่อผู้กรอก:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="กรอกชื่อของคุณ"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />

        <label>คำอธิบาย:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="อธิบายงานโดยสังเขป"
          rows="4"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />

        <label>ประเภทงาน:</label>
        <select
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        >
          <option>งานไฟฟ้า</option>
          <option>งานเชื่อม</option>
          <option>งานทำความสะอาด</option>
        </select>

        <button
          type="submit"
          style={{
            backgroundColor: "#0070f3",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          💾 Submit
        </button>
      </form>
    </div>
  );
}

