'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePrivateGameStore } from '@/lib/store/usePrivateGameStore';
import { VscLoading, VscHome, VscArrowRight, VscDebugRestart } from 'react-icons/vsc';
import { FaUserSecret, FaFlagCheckered, FaUserShield } from 'react-icons/fa';
import { Role } from '@/interfaces/Role';
import PlayerCard from "../../components/PlayerCard";

const GameLobbyPage = () => {
  const params = useParams();
  const router = useRouter();
  const gameId = Number(params.id);

  const { gameDetails, shufflePlayers, finishGame, finishingGame, closeGame } = usePrivateGameStore();

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isCardRevealed, setIsCardRevealed] = useState(false);
  const [gamePhase, setGamePhase] = useState<'LOADING' | 'REVEAL' | 'PLAYING' | 'ENDED'>('LOADING');

  useEffect(() => {
    if (gameDetails) {
      shufflePlayers();
      setGamePhase('REVEAL');
    }
  }, [gameDetails?.id]);

  const participants = gameDetails?.participants ?? [];
  const currentPlayer = participants[currentPlayerIndex];

  const handleNextPlayer = () => {

    setIsCardRevealed(false);

    setTimeout(() => {
      const nextIndex = currentPlayerIndex + 1;
      if (nextIndex >= participants.length) {
        setGamePhase('PLAYING');
      } else {
        setCurrentPlayerIndex(nextIndex);
      }
    }, 300);
  };

  const handleEndGame = async () => {
    if (!gameId) return;
    const success = await finishGame();
    if (success) setGamePhase('ENDED');
  };

  if (gamePhase === 'LOADING' || !currentPlayer || !gameDetails) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <VscLoading className="animate-spin text-3xl text-[#FF493C]" />
      </div>
    );
  }

  // --- PHASE: ENDED ---
  if (gamePhase === 'ENDED') {
    return (
      <div className="flex flex-col items-center justify-start h-screen max-h-screen bg-gray-900 text-white p-6 pt-20 overflow-hidden">
        <div className="w-full max-w-sm animate-fade-in flex flex-col h-full">
          <h1 className="text-2xl font-bold text-center mb-4 uppercase">Results</h1>

          <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
            <div className="bg-black/40 border border-white/10 p-3 rounded-xl text-center">
              <p className="text-[10px] text-white/40 uppercase">Word</p>
              <p className="text-lg font-bold text-blue-400 uppercase leading-tight">{gameDetails.word}</p>
            </div>
            <div className="bg-black/40 border border-white/10 p-3 rounded-xl text-center">
              <p className="text-[10px] text-white/40 uppercase">Imposters</p>
              <p className="text-lg font-bold text-red-500 leading-tight">
                {participants.filter(p => p.role === Role.Imposter).length}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1 scrollbar-hide">
            {participants.map((p, idx) => {
              const isImp = p.role === Role.Imposter;
              return (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${isImp ? "bg-red-950/20 border-red-600/50" : "bg-white/5 border-transparent"}`}>
                  <div className="flex items-center gap-2 text-sm">
                    {isImp ? <FaUserSecret className="text-red-500" /> : <FaUserShield className="text-white/30" />}
                    <span className={`font-bold ${isImp ? "text-red-500" : "text-white"}`}>{p.name}</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/10 text-white/40">
                    {p.role.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>

          <button onClick={() => { closeGame(); router.push('/'); }} className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 mt-auto mb-6 shrink-0">
            <VscHome /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  // --- PHASE: PLAYING ---
  if (gamePhase === 'PLAYING') {
    return (
      <div className="flex flex-col items-center justify-start h-screen bg-gray-900 text-white p-6 pt-24 overflow-hidden">
        <div className="w-full max-w-sm text-center">
          <FaUserSecret className="text-5xl text-[#FF493C] mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-1 uppercase">Game is Live</h1>
          <p className="text-white/50 text-xs mb-8">Discuss and find the imposter.</p>
          
          <div className="bg-black/40 p-5 rounded-xl mb-8 border border-white/5 inline-block px-10">
             <p className="text-xl font-mono text-green-400 font-bold uppercase tracking-widest">In Progress</p>
          </div>

          <button 
            onClick={handleEndGame} 
            disabled={finishingGame}
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-4 rounded-xl hover:bg-[#FF493C] hover:text-white transition-all disabled:opacity-50 shadow-lg"
          >
            {finishingGame ? <VscLoading className="animate-spin" /> : <FaFlagCheckered />}
            End Game
          </button>
        </div>
      </div>
    );
  }

  // --- PHASE: REVEAL ---
  return (
    <div className="flex flex-col items-center justify-start h-screen max-h-screen bg-gray-900 text-white p-4 pt-20 overflow-hidden">
      <div className="mb-4 text-center shrink-0">
        <p className="text-lg font-bold">
            Player {currentPlayerIndex + 1} <span className="text-white/20">/ {participants.length}</span>
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full min-h-0">
        <PlayerCard
            name={currentPlayer.name}
            role={currentPlayer.role}
            word={gameDetails.word}
            imposterHint={gameDetails.imposterHint}
            isRevealed={isCardRevealed}
            onReveal={() => setIsCardRevealed(true)}
        />
      </div>

      <div className="h-20 flex items-center w-full max-w-[280px] shrink-0 mb-4">
        {isCardRevealed && (
          <button
            onClick={handleNextPlayer}
            className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl animate-fade-in-up"
          >
            {currentPlayerIndex < participants.length - 1 ? (
              <>Next Player <VscArrowRight /></>
            ) : (
              <>Start Game <VscDebugRestart /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default GameLobbyPage;