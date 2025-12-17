'use client';

import React from 'react';
import { Role } from '@/interfaces/Role';

interface PlayerCardProps {
  ime: string;
  vloga: Role;
  beseda: string;
  imposterNamig: string;
  razkrito: boolean;
  onReveal: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  ime,
  vloga,
  beseda,
  imposterNamig,
  razkrito,
  onReveal,
}) => {
  const jeImposter = vloga === Role.Imposter;

  return (
    <div
      className="perspective-1000 w-full max-w-sm h-96 cursor-pointer"
      onClick={() => !razkrito && onReveal()}
    >
      <div
        className={`relative w-full h-full transition-all duration-700 transform-style-3d ${
          razkrito ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT */}
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-black border-4 border-white/20 rounded-2xl flex flex-col items-center justify-center p-6">
            <span className="text-3xl font-bold mb-4">{ime}</span>
            <p className="text-[#FF493C]">Tap to reveal</p>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div
            className={`w-full h-full rounded-2xl flex flex-col items-center justify-center p-6 border-4 ${
              jeImposter
                ? 'bg-red-950 border-red-600'
                : 'bg-blue-950 border-blue-500'
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">{vloga}</h2>
            <p className="text-xl text-center">
              {jeImposter ? imposterNamig : beseda}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
