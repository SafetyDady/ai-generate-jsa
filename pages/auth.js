// frontend/pages/auth.js
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Registered!");
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Logged in!");
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            🔐 เข้าสู่ระบบ / ลงทะเบียน
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              อีเมล
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              รหัสผ่าน
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleRegister}>
              ลงทะเบียน
            </Button>
            <Button onClick={handleLogin}>เข้าสู่ระบบ</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
