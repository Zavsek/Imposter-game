'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePrivateGameStore } from '@/lib/store/usePrivateGameStore';
import { VscLoading, VscHome } from 'react-icons/vsc';
import { FaUserSecret, FaFlagCheckered } from 'react-icons/fa';
import { Role } from '@/interfaces/Role';
import PlayerCard from "../../components/PlayerCard";

const GameLobbyPage = () => {
  const params = useParams();
  const router = useRouter();
  const gameId = Number(params.id);

  const { gameDetails, shufflePlayers, finishGame, finishingGame } =
    usePrivateGameStore();

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isCardRevealed, setIsCardRevealed] = useState(false);
  const [gamePhase, setGamePhase] = useState<
    'LOADING' | 'REVEAL' | 'PLAYING' | 'ENDED'
  >('LOADING');

  useEffect(() => {
    if (gameDetails) {
      shufflePlayers();
      setGamePhase('REVEAL');
    }
  }, [gameDetails?.id]);

  const participants = gameDetails?.participants ?? [];
  const currentPlayer = participants[currentPlayerIndex];
  const imposters = participants.filter(p => p.role === Role.Imposter);

  const handleNextPlayer = () => {
    setIsCardRevealed(false);
    console.log("PASSING ROLE:", currentPlayer.role);
console.log("ROLE ENUM:", Role.Imposter);
console.log("EQUALS:", currentPlayer.role === Role.Imposter);
    const nextIndex = currentPlayerIndex + 1;
    if (nextIndex >= participants.length) {
      setGamePhase('PLAYING');
    } else {

      setCurrentPlayerIndex(nextIndex);
    }
  };

  const handleEndGame = async () => {
    if (!gameId) return;
    const success = await finishGame();
    if (success) setGamePhase('ENDED');
  };

  if (gamePhase === 'LOADING' || !currentPlayer || !gameDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <VscLoading className="animate-spin text-4xl" />
      </div>
    );
  }

  if (gamePhase === 'ENDED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 text-center">
        <FaFlagCheckered className="text-6xl text-[#FF493C] mb-4" />
        <h1 className="text-3xl mb-6">Imposters</h1>
        {imposters.map(p => (
          <div key={p.name}>{p.name}</div>
        ))}
        <button onClick={() => router.push('/')}>
          <VscHome /> Home
        </button>
      </div>
    );
  }

  if (gamePhase === 'PLAYING') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <FaUserSecret className="text-6xl mb-6" />
        <button onClick={handleEndGame} disabled={finishingGame}>
          End Game
        </button>
      </div>
    );
  }

  // REVEAL
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <PlayerCard
        ime={currentPlayer.name}
        vloga={currentPlayer.role}
        beseda={gameDetails.word}
        imposterNamig={gameDetails.imposterHint}
        razkrito={isCardRevealed}
        onReveal={() => setIsCardRevealed(true)}
      />

      {isCardRevealed && (
        <button
          onClick={handleNextPlayer}
          className="mt-8 bg-white text-black px-6 py-3 rounded font-bold"
        >
          {currentPlayerIndex < participants.length - 1
            ? 'Next Player'
            : 'Start Game'}
        </button>
      )}
    </div>
  );
};

export default GameLobbyPage;
