'use client'

import React, { useState } from 'react'
import { VscLoading, VscAdd } from "react-icons/vsc"
import { FaUserSecret, FaChartBar, FaGamepad } from "react-icons/fa"
import CreatePrivateLobbyModal from '../components/CreatePrivateLobbyModel';

export default function HomePage() {
  const [joinCode, setJoinCode] = useState("");
  const [loadingCreatePrivate, setLoadingCreatePrivate] = useState(false);
  const [loadingCreatePublic, setLoadingCreatePublic] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreatePrivateGame = async () => {
    setIsModalOpen(true);
  };

  const handleCreatePublicLobby = async () => {
    setLoadingCreatePublic(true);
    setTimeout(() => setLoadingCreatePublic(false), 1500);
  };

  const handleJoinGame = async () => {
    if (!joinCode) return;
    setLoadingJoin(true);
    setTimeout(() => setLoadingJoin(false), 1500);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr mt-20">

        {/* HOST OPERATION - Left side, spans 2 columns on md+ */}
        <div className="md:col-span-2">
          <div className="glass-card2 bg-black/70 backdrop-blur-md border-4 border-white/90 shadow-2xl p-8 flex flex-col justify-between rounded-xl relative overflow-hidden group w-full h-full">
            <div className="absolute right-0 bottom-0 opacity-10 text-[16rem] translate-x-8 translate-y-8 rotate-12 group-hover:rotate-0 transition-transform duration-[900ms] pointer-events-none text-white">
              <FaUserSecret />
            </div>

            <div className="z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#fa3d2f] text-black p-2 rounded-md shadow-lg">
                  <FaUserSecret size={24} />
                </div>
                <h2 className="text-3xl text-white font-secondary font-bold tracking-wide">HOST OPERATION</h2>
              </div>

              <p className="text-white/80 font-primary text-lg max-w-md leading-relaxed">
                Initiate a secure channel. You control the suspects, environment, and entire operation.
              </p>
            </div>

            <div className="z-10 mt-8 flex flex-col md:flex-row gap-4">
              <button
                onClick={handleCreatePrivateGame}
                disabled={loadingCreatePrivate}
                className="flex-1 px-6 py-3 bg-[rgba(0,0,120,0.7)] hover:bg-[rgba(0,0,150,0.9)] border-2 border-white text-[#FF493C] text-lg font-bold rounded-md science-gothic shadow-[0_0_15px_rgba(0,0,120,0.6)] transition-all flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-[0.98]"
              >
                {loadingCreatePrivate ? <VscLoading className="animate-spin text-2xl" /> : (<><VscAdd className="text-2xl" /> PRIVATE GAME</>)}
              </button>
              <button
                onClick={handleCreatePublicLobby}
                disabled={loadingCreatePublic}
                className="flex-1 px-6 py-3 bg-[rgba(0,0,120,0.7)] hover:bg-[rgba(0,0,150,0.9)] border-2 border-white text-[#FF493C] text-lg font-bold rounded-md science-gothic shadow-[0_0_15px_rgba(0,0,120,0.6)] transition-all flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-[0.98]"
              >
                {loadingCreatePublic ? <VscLoading className="animate-spin text-2xl" /> : (<><VscAdd className="text-2xl" /> PUBLIC LOBBY</>)}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Join and Service Record */}
        <div className="flex flex-col gap-4 md:col-span-1">
          {/* JOIN FREQUENCY */}
          <div className="glass-card2 bg-black/70 backdrop-blur-md border-4 border-white/90 shadow-xl p-6 flex flex-col justify-center rounded-xl w-full h-auto">
            <div className="flex items-center gap-2 mb-3 text-[#FF493C]">
              <FaGamepad size={20} />
              <h3 className="text-xl text-white font-secondary font-semibold tracking-wide">JOIN FREQUENCY</h3>
            </div>

            <div className="flex flex-col gap-3">
              <input
                className="border-2 border-white/90 bg-black/70 text-white/90 rounded-md p-3 w-full font-primary text-center tracking-[0.2em] text-xl uppercase placeholder:text-white/40 focus:outline-none focus:border-[#FF493C] transition-all"
                placeholder="ENTER CODE"
                maxLength={6}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              />

              <button
                onClick={handleJoinGame}
                disabled={loadingJoin || !joinCode}
                className="w-full py-2 bg-[rgba(0,0,120,0.7)] text-[#FF493C] border-2 border-white rounded-md text-lg science-gothic flex items-center justify-center gap-2 hover:bg-[rgba(0,0,150,0.9)] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loadingJoin ? <VscLoading className="animate-spin" /> : "INFILTRATE"}
              </button>
            </div>
          </div>

          {/* TRANSFORMED SERVICE RECORD - Now "AGENT PROFILE" with custom stats */}
          <div className="glass-card2 bg-[rgba(13,0,80,0.7)] backdrop-blur-md border-4 border-white/90 shadow-xl p-6 flex flex-col rounded-xl w-full h-auto flex-grow">
            <div className="flex items-center gap-2 mb-4 text-white">
              <FaUserSecret size={20} />
              <h3 className="text-xl font-secondary font-bold tracking-wide">AGENT PROFILE</h3>
            </div>

            <div className="flex-1 flex flex-col gap-3 text-white/90 font-primary text-sm">
              <div className="flex justify-between items-center pb-1 border-b border-white/20">
                <span className="text-white/70 uppercase">Missions Completed</span>
                <span className="text-[#FF493C] font-bold">12</span>
              </div>
              <div className="flex justify-between items-center pb-1 border-b border-white/20">
                <span className="text-white/70 uppercase">Imposters Exposed</span>
                <span className="text-[#FF493C] font-bold">8</span>
              </div>
              <div className="flex justify-between items-center pb-1 border-b border-white/20">
                <span className="text-white/70 uppercase">Survival Rate</span>
                <span className="text-[#FF493C] font-bold">75%</span>
              </div>
              <div className="flex justify-between items-center pb-1 border-b border-white/20">
                <span className="text-white/70 uppercase">Deception Score</span>
                <span className="text-[#FF493C] font-bold">92/100</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-white/70 uppercase">Rank</span>
                <span className="text-[#FF493C] font-bold">Elite Operative</span>
              </div>
            </div>

            <div className="mt-6 text-xs text-white/40 text-center font-primary uppercase tracking-widest">
              Clearance Level: Classified
            </div>
          </div>
        </div>
      </div>
      <CreatePrivateLobbyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
    />
    </div>
  );
}