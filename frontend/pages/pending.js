// frontend/pages/pending.js
export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="bg-white p-6 rounded shadow-md text-center max-w-md">
        <h1 className="text-xl font-semibold text-yellow-700 mb-2">⏳ รออนุมัติ</h1>
        <p className="text-gray-600">
          บัญชีของคุณอยู่ระหว่างรอการอนุมัติจากผู้ดูแลระบบ
          กรุณารอให้แอดมินอนุมัติก่อนเข้าใช้งานระบบ
        </p>
      </div>
    </div>
  );
}
