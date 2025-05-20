// frontend/pages/rejected.js
export default function RejectedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-6 rounded shadow-md text-center max-w-md">
        <h1 className="text-xl font-semibold text-red-700 mb-2">❌ ไม่ได้รับอนุมัติ</h1>
        <p className="text-gray-600">
          ขออภัย บัญชีของคุณไม่ได้รับอนุมัติให้เข้าใช้งานระบบ<br />
          หากมีข้อสงสัยกรุณาติดต่อผู้ดูแลระบบ
        </p>
      </div>
    </div>
  );
}
