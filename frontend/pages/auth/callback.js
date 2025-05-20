// pages/auth/callback.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // ✅ แก้ตรงนี้

export default function AuthCallback() {
  const router = useRouter();
  const [message, setMessage] = useState('กำลังตรวจสอบลิงก์...');

  useEffect(() => {
    const completeSignIn = async () => {
      const email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        setMessage('ไม่พบอีเมลที่ใช้ลงชื่อเข้าใช้');
        return;
      }

      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          const result = await signInWithEmailLink(auth, email, window.location.href);
          const uid = result.user.uid;
          const userRef = doc(db, 'users', uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              email,
              createdAt: new Date().toISOString(),
              role: 'user',
              status: 'pending',
              organizationId: 'org001',
            });
            router.push('/pending');
          } else {
            const data = userSnap.data();
            if (data.status === 'active') router.push('/dashboard');
            else if (data.status === 'pending') router.push('/pending');
            else router.push('/rejected');
          }
        } catch (error) {
          console.error(error);
          setMessage('เกิดข้อผิดพลาดในการลงชื่อเข้าใช้');
        }
      }
    };

    completeSignIn();
  }, [router]);

  return <p className="p-4 text-center">{message}</p>;
}
