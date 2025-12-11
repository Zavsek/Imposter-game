'use client'

import { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { loginRequest } from "@/interfaces";
import { VscLoading } from "react-icons/vsc";
import { useRouter } from "next/navigation";




export default function LoginPage() {
  const { login, checkingAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
    const request: loginRequest = {
        email: email,
        password:password
    } 
    const handleRegistrationClick= ()=>{
      router.push("/auth/register");
    }
    const postLogin =()=>{
      login(request);
    }
  return (
    <div className="glass-card px-10 mt-10 backdrop-blur-xs  shadow-2xl flex-col items-center ">
      <h1 className="text-2xl  min-w-full justify-center text-center items-center mb-15 mt-5  text-white/90 font-secondary font-semibold">LOGIN</h1>

      <input 
        className="border-2 border-white/90 bg-black/60 text-white/80 rounded-sm p-2 w-full mb-3 font-primary"
        placeholder="Email"
        value={email}
        onChange={(e)=> setEmail(e.target.value)}
      />

      <input 
        className="border-2 border-white/90 bg-black/60 text-white/80 rounded-sm p-2 w-full mb-3 font-primary"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
      />

      <button 
        onClick={()=>postLogin}
        className="w-full bg-[rgba(0,0,100,0.6)] text-[#FF493C] font-normal  border-2 border-white py-2 rounded science-gothic cursor-pointer mt-10 "
      >
        {checkingAuth ? <VscLoading className="animate-spin "/>: "Login"}
      </button>
      <div className="text-white/60 text-sm mt-2">Don't have an account yet? <span className="cursor-pointer text-[rgba(50,30,160,0.8)]  " onClick={handleRegistrationClick}>Register</span></div>
    </div>
  );
}
