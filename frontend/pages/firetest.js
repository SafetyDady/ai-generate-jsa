// ✅ pages/firetest.js
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function FirestoreTestPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const testFirestore = async () => {
      try {
        const testRef = doc(db, "testCollection", "demoDoc");

        // 🔧 เขียนข้อมูลเข้า Firestore
        await setDoc(testRef, {
          message: "✅ Firestore Connected!",
          timestamp: new Date().toISOString(),
        });

        // 🔁 อ่านข้อมูลกลับมา
        const snapshot = await getDoc(testRef);
        setData(snapshot.data());

        console.log("🔥 Firestore document data:", snapshot.data());
      } catch (err) {
        console.error("❌ Firestore Error:", err);
        setData({ error: err.message });
      }
    };

    testFirestore();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 className="text-2xl font-bold text-center mb-4">🔥 Firestore Test</h1>

      {data ? (
        <pre className="bg-gray-100 p-4 rounded shadow">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-500">⏳ Loading...</p>
      )}
    </div>
  );
}
