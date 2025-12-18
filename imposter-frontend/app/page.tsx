import React from 'react'
import { VscLoading } from "react-icons/vsc";
import { FaLock } from "react-icons/fa";

export default function LoadingPage () {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card w-full max-w-md p-10 backdrop-blur-md shadow-2xl flex flex-col items-center border border-white/10 rounded-2xl bg-zinc-950/50">

        <div className="relative mb-6">
          <FaLock className="text-[#FF493C] size-8 animate-pulse" />
          <div className="absolute inset-0 bg-[#FF493C]/20 blur-xl rounded-full"></div>
        </div>

        <h2 className="text-white font-black tracking-widest text-xl mb-2 uppercase">
          Initializing
        </h2>
        
        <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase mb-8">
          Syncing encrypted data...
        </p>


        <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
          <VscLoading className="animate-spin text-[#FF493C]" size={20} />
          <span className="text-sm font-bold text-white/80 tracking-tight">Loading Lobby</span>
        </div>


        <div className="mt-10 flex gap-1">
          <div className="w-12 h-2px bg-[#FF493C]/50"></div>
          <div className="w-2 h-2px bg-[#FF493C]"></div>
          <div className="w-2 h-2px bg-[#FF493C]/20"></div>
        </div>
      </div>
    </div>
  )
}