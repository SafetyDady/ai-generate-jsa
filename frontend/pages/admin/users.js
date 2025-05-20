// frontend/pages/admin/users.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../firebase';
import { collection, getDocs, updateDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminAndUsers = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push('/login');
        return;
      }

      const uid = currentUser.uid;
      const adminRef = doc(db, 'users', uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        router.push('/login');
        return;
      }

      const adminData = adminSnap.data();
      if (adminData.role !== 'admin') {
        setAccessDenied(true);
        return;
      }

      const q = query(
        collection(db, 'users'),
        where('organizationId', '==', adminData.organizationId)
      );
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(list);
      setLoading(false);
    };

    fetchAdminAndUsers();
  }, [router]);

  const updateStatus = async (id, status) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { status });
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  };

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-6 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">⛔ ไม่อนุญาต</h1>
          <p className="text-gray-700">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">👥 จัดการผู้ใช้งานในองค์กร</h1>
      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : (
        <table className="w-full border bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left">อีเมล</th>
              <th className="py-2 px-4 text-left">สถานะ</th>
              <th className="py-2 px-4">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.status}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => updateStatus(user.id, 'active')}
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                    disabled={user.status === 'active'}
                  >อนุมัติ</button>
                  <button
                    onClick={() => updateStatus(user.id, 'rejected')}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    disabled={user.status === 'rejected'}
                  >ปฏิเสธ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
