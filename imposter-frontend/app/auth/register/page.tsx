'use client'
import React, { useState } from 'react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { registerRequest } from '@/interfaces';
import { VscLoading } from 'react-icons/vsc';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';



export default function RegisterPage() {
    const{register, registering} = useAuthStore();
    const[username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
     const [password, setPassword] = useState<string>("");
     const[emailError, setEmailError] = useState<string>("");
     const[passwordError, setPasswordError] = useState<string>("");
     const[validating, setValidating] = useState<boolean>(false);
    const router = useRouter();


     const request:registerRequest = {
        username:username,
        email:email,
        password:password
     }
     const postRegister = async () =>{
            setValidating(true);
            if(!username || !email || !password){
                            setValidating(false);
                toast.error("Please ensure all fields are filled in")
                return;
            }
            const emailValidation = checkEmail();
            const passwordValidation = checkPassword()
            if(!emailValidation|| !passwordValidation){
                            setValidating(false);
                return;
            }
        try {
      const registrationSucces = await register(request);
      if(registrationSucces) router.push("/auth/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setValidating(false); 
    }
     }
      function checkEmail(): boolean {
        if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email.");
      return false;
    }
    else{
        setEmailError("");
        return true;

    } 
    }
    function checkPassword(): boolean{
        if(password.length < 8)
            {
            setPasswordError("password needs to be atleast 8 characters long")
            return false
        }
        else {
            setPasswordError("");
            return true}
    }
     const handleLoginClick = () =>{
        router.push("/auth/login")
     }
  return (
    <div className="glass-card px-10 mt-10 backdrop-blur-xs  shadow-2xl flex-col items-center ">
          <h1 className="text-2xl  min-w-full justify-center text-center items-center mb-7 mt-5  text-white/90 font-secondary font-semibold">REGISTER</h1>

           <input 
            className="border-2 border-white/90 bg-black/60 text-white/80 rounded-sm p-2 w-full mt-3 font-primary"
            placeholder="username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />
          <input 
            className="border-2 border-white/90 bg-black/60 text-white/80 rounded-sm p-2 w-full mt-3 font-primary"
            placeholder="Email"
            value={email}
            onChange={(e)=> {
                setEmail(e.target.value)
                checkEmail()}}
          />
          <p className='text-red-500 text-xs absolute'>{emailError}</p>
    
          <input 
            className="border-2 border-white/90 bg-black/60 text-white/80 rounded-sm p-2 w-full mt-5 font-primary"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=> {
                setPassword(e.target.value)
                checkPassword()}}
          />
        <p className='text-red-500 text-xs absolute'>{passwordError}</p>
          <button 
            onClick={postRegister}
            disabled={validating || registering}
            className="w-full bg-[rgba(0,0,100,0.6)] text-[#FF493C] font-normal  border-2 border-white py-2 rounded science-gothic cursor-pointer mt-5 "
          >
            {registering || validating ? <VscLoading className="animate-spin w-full "/>: "Register"}
          </button>
          <div className="text-white/60 text-sm mt-2">Already have an account? <span className="cursor-pointer text-[rgba(50,30,160,0.8)]  " onClick={handleLoginClick}>Login</span></div>
        </div>
  )
}
