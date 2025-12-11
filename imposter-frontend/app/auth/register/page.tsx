'use client'
import React, { useState } from 'react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { registerRequest } from '@/interfaces';
import { VscLoading } from 'react-icons/vsc';
import { useRouter } from 'next/navigation';



export default function RegisterPage() {
    const{register, registering} = useAuthStore();
    const[username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
     const [password, setPassword] = useState<string>("");
    const router = useRouter();


     const request:registerRequest = {
        username:username,
        email:email,
        password:password
     }
     const postRegister = () =>{
        register(request);
     }
     const handleLoginClick = () =>{
        router.push("/auth/login")
     }
  return (
    <div className="glass-card px-10 mt-10 backdrop-blur-xs  shadow-2xl flex-col items-center ">
          <h1 className="text-2xl  min-w-full justify-center text-center items-center mb-6 mt-5  text-white/90 font-secondary font-semibold">REGISTER</h1>

           <input 
            className="border-2 border-white/90 bg-black/60 text-white/80 rounded-sm p-2 w-full mb-3 font-primary"
            placeholder="username"
            value={username}
            onChange={(e)=> setUsername(e.target.value)}
          />
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
            onClick={()=>postRegister}
            className="w-full bg-[rgba(0,0,100,0.6)] text-[#FF493C] font-normal  border-2 border-white py-2 rounded science-gothic cursor-pointer mt-5 "
          >
            {registering ? <VscLoading className="animate-spin "/>: "Register"}
          </button>
          <div className="text-white/60 text-sm mt-2">Already have an account? <span className="cursor-pointer text-[rgba(50,30,160,0.8)]  " onClick={handleLoginClick}>Login</span></div>
        </div>
  )
}
