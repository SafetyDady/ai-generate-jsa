// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: ตรวจสอบ domain อีเมลองค์กร
    // if (!email.endsWith('@ng-company.com')) {
    //   setStatus('ระบบเปิดใช้งานเฉพาะผู้ใช้องค์กรเท่านั้น');
    //   return;
    // }

    const actionCodeSettings = {
      url: `${window.location.origin}/auth/callback`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setStatus('✅ ลิงก์เข้าสู่ระบบถูกส่งไปยังอีเมลแล้ว');
    } catch (error) {
      console.error(error);
      setStatus('❌ ไม่สามารถส่งลิงก์ได้');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">JSA Auto Generate</h1>
        <input
          type="email"
          placeholder="อีเมลองค์กร"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          ส่งลิงก์เข้าสู่ระบบ
        </button>
        {status && <p className="mt-4 text-center">{status}</p>}
      </form>
    </div>
  );
}