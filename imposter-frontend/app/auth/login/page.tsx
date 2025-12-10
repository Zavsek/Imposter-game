'use client'

import { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { loginRequest } from "@/interfaces";



export default function LoginPage() {
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setGeslo] = useState("");

  const prijavi = async () => {
    const request: loginRequest = {
        email: email,
        password:password
    } 
    await login(request);
  };

  return (
    <div className="p-6 bg-slate/80  shadow-md w-80 min-h-100 rounded-xs border-2 border-black backdrop-blur-2xl ">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <input 
        className="border p-2 w-full mb-3"
        placeholder="Email"
        value={email}
        onChange={(e)=> setEmail(e.target.value)}
      />

      <input 
        className="border p-2 w-full mb-3"
        type="password"
        placeholder="Geslo"
        value={password}
        onChange={(e)=> setGeslo(e.target.value)}
      />

      <button 
        onClick={prijavi}
        className="w-full bg-black text-white py-2 rounded"
      >
        Prijava
      </button>
    </div>
  );
}
