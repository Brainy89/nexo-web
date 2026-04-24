"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin"); // Login အောင်ရင် Admin ဆီသွားမယ်
    } catch (error) {
      alert("Login Failed! Please check your credentials.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#fafafa] px-6">
      <form onSubmit={handleLogin} className="max-w-sm w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-8 text-center italic">Admin Access</h1>
        <div className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 rounded-xl outline-none" onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-xl outline-none" onChange={(e)=>setPassword(e.target.value)} required />
          <button className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-600 transition">Login</button>
        </div>
      </form>
    </div>
  );
}