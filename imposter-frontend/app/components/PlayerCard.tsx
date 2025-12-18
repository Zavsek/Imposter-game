'use client';

import React from 'react';
import { Role } from '@/interfaces/Role';
import { VscEye } from 'react-icons/vsc';
import { FaUserSecret, FaUserShield } from 'react-icons/fa';

interface PlayerCardProps {
  name: string;
  role: Role;
  word: string;
  imposterHint: string;
  isRevealed: boolean;
  onReveal: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  role,
  word,
  imposterHint,
  isRevealed,
  onReveal,
}) => {
  const isImposter = role === Role.Imposter;

  return (
    <div
      className="perspective-1000 w-full max-w-[280px] h-[380px] cursor-pointer"
      onClick={() => !isRevealed && onReveal()}
    >
      <div
        className={`relative w-full h-full transition-all duration-700 transform-style-3d ${
          isRevealed ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT: Vedno nevtralna črna, da se ne izda vloga vnaprej */}
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-gray-950 border-2 border-white/10 rounded-2xl flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
               <span className="text-2xl font-bold text-white/50">{name.charAt(0).toUpperCase()}</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{name}</h2>
            <div className="flex items-center gap-2 text-[#FF493C] mt-2">
               <VscEye />
               <span className="text-xs font-bold uppercase tracking-widest">Tap to reveal</span>
            </div>
          </div>
        </div>

        {/* BACK: Barva se pokaže šele tukaj */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div
            className={`w-full h-full rounded-2xl flex flex-col items-center justify-center p-6 border-4 shadow-2xl ${
              isRevealed 
                ? (isImposter ? 'bg-red-950 border-red-600' : 'bg-blue-950 border-blue-500') 
                : 'bg-gray-950 border-white/10'
            }`}
          >
            <div className="mb-4">
               {isImposter ? <FaUserSecret className="text-5xl text-red-500" /> : <FaUserShield className="text-5xl text-blue-400" />}
            </div>
            
            <h2 className={`text-xl font-bold mb-4 uppercase tracking-wider ${isImposter ? 'text-red-500' : 'text-blue-400'}`}>
               {role}
            </h2>

            <div className="w-full bg-black/40 p-4 rounded-lg border border-white/5 text-center">
               <p className="text-[10px] text-white/40 uppercase mb-1">{isImposter ? "Hint" : "Word"}</p>
               <p className="text-xl font-bold text-white uppercase">{isImposter ? imposterHint : word}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;