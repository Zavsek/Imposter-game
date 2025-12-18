"use client";

import React, { useState, useEffect } from "react";
import { VscLoading, VscAdd, VscClose } from "react-icons/vsc";
import { FaLock } from "react-icons/fa";
import { usePrivateGameStore } from "@/lib/store/usePrivateGameStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createGameRequest } from "@/interfaces";
import { PlayerList } from "./PlayerList";
import { WordListSelector } from "./WordListSelector";
import { PRESET_WORD_LISTS, PRESET_WORD_LISTS_SLO } from "@/lib/wordlists";

const CUSTOM_LIST_NAME = "Custom Word";
const MIN_PLAYERS = 3;
const MAX_PLAYERS = 16;
const MAX_IMPOSTERS = 4;

const ALL_AVAILABLE_LISTS = [...PRESET_WORD_LISTS, ...PRESET_WORD_LISTS_SLO];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePrivateLobbyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { username: hostUsername, playerId: hostId } = useAuthStore();
  const { createGame, creatingPrivateGame } = usePrivateGameStore();
  const router = useRouter();

  const [players, setPlayers] = useState<string[]>([]);
  const [newName, setNewName] = useState("");
  const [word, setWord] = useState("");
  const [imposterHint, setImposterHint] = useState("");
  const [numOfImposters, setNumOfImposters] = useState(1);
  const [isListSelectorOpen, setIsListSelectorOpen] = useState(false);
  const [activeListName, setActiveListName] = useState(
    PRESET_WORD_LISTS[0]?.name || CUSTOM_LIST_NAME
  );
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [isCustomMode, setIsCustomMode] = useState(false);


  const STORAGE_KEY = "imposter_selected_lists";

  useEffect(() => {
  if (isOpen) {
    setPlayers([hostUsername || "Host"]);
    
    // Poskusi prebrati iz localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedLists(parsed);
          setWord("RANDOM_FROM_LIST");
          return; 
        }
      } catch (e) {
        console.error("Error loading saved lists", e);
      }
    }

    if (PRESET_WORD_LISTS_SLO.length > 0) {
      setSelectedLists([PRESET_WORD_LISTS_SLO[0].name]);
      setWord("RANDOM_FROM_LIST");
    }
  }
}, [isOpen, hostUsername]);

  const maxPossibleImposters = Math.min(
    MAX_IMPOSTERS,
    Math.floor(players.length / 2)
  );

  const handleAddPlayer = () => {
    const trimmed = newName.trim();
    if (!trimmed || players.length >= MAX_PLAYERS) return;
    if (players.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Name taken.");
      return;
    }
    setPlayers([...players, trimmed]);
    setNewName("");
  };

 const handleChooseWordList = (listName: string) => {
  setIsCustomMode(false);
  setSelectedLists(prev => {
    const isAlreadySelected = prev.includes(listName);
    let newList;
    
    if (isAlreadySelected) {
      newList = prev.filter(name => name !== listName);
    } else {
      newList = [...prev, listName];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));

    if (newList.length === 0) setWord(""); 
    else setWord("RANDOM_FROM_LIST");
    
    return newList;
  });
};
  const handleSubmit = async () => {
    if (!hostId || players.length < MIN_PLAYERS) return;

    let finalWord = word;
    let finalHint = imposterHint;

    if (!isCustomMode && selectedLists.length > 0) {
      const combinedPool = ALL_AVAILABLE_LISTS.filter((l) =>
        selectedLists.includes(l.name)
      ).flatMap((l) => l.items);

      if (combinedPool.length > 0) {
        const randomIndex = Math.floor(Math.random() * combinedPool.length);
        finalWord = combinedPool[randomIndex].word;
        finalHint = combinedPool[randomIndex].hint;
      }
    }

    if (!finalWord.trim() || finalWord === "RANDOM_FROM_LIST") {
      toast.error("Izberi sezname ali vnesi svojo besedo.");
      return;
    }

    const request: createGameRequest = {
      hostId: hostId,
      names: players,
      numOfImposters: numOfImposters,
      word: finalWord.trim(),
      imposterHint: finalHint.trim(),
    };

    const gameDetails = await createGame(request);
    if (gameDetails) {
      onClose();
      router.push(`/privateGame/${gameDetails.id}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[85vh] bg-zinc-950 border border-white/10 shadow-2xl flex flex-col relative overflow-hidden text-white rounded-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
            <FaLock className="text-[#FF493C]" /> NEW PRIVATE GAME
          </h1>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform p-1"
          >
            <VscClose size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Setup Side */}
          <div className="w-full md:w-80 p-6 border-r border-white/5 overflow-y-auto space-y-6 shrink-0">
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  Secret Word
                </label>
                <button
                  onClick={() => setIsListSelectorOpen(true)}
                  className="text-[10px] text-[#FF493C] font-bold hover:underline uppercase"
                >
                  Lists
                </button>
              </div>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-[#FF493C] outline-none transition-all font-bold uppercase tracking-wider disabled:opacity-50"
                value={
                  isCustomMode
                    ? word
                    : selectedLists.length > 0
                    ? `SELECTED: (${selectedLists.length})`
                    : "SELECT A LIST..."
                }
                onChange={(e) => {
                  setIsCustomMode(true);
                  setSelectedLists([]);
                  setWord(e.target.value);
                }}
                placeholder="ENTER A WORD..."
                readOnly={!isCustomMode}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
                Imposters
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() =>
                      num <= maxPossibleImposters && setNumOfImposters(num)
                    }
                    className={`py-2 rounded-lg font-bold text-sm border-2 transition-all ${
                      num === numOfImposters
                        ? "bg-[#FF493C] border-[#FF493C] text-black"
                        : num <= maxPossibleImposters
                        ? "bg-white/5 border-white/10 text-white"
                        : "opacity-20 cursor-not-allowed border-transparent"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Players Side */}
          <div className="flex-1 p-6 flex flex-col overflow-hidden min-h-0">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
              Players ({players.length}/{MAX_PLAYERS})
            </label>
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-white/30"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
                placeholder="Type name..."
              />
              <button
                onClick={handleAddPlayer}
                className="bg-white text-black p-3 rounded-lg hover:bg-[#FF493C] hover:text-white transition-colors"
              >
                <VscAdd size={20} />
              </button>
            </div>

            <PlayerList
              players={players}
              hostUsername={hostUsername}
              onRemove={(name) => setPlayers(players.filter((p) => p !== name))}
              disabled={creatingPrivateGame}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-zinc-900/50 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={
              players.length < MIN_PLAYERS ||
              !word.trim() ||
              creatingPrivateGame
            }
            className="w-full py-4 bg-white text-black font-black text-lg rounded-xl hover:bg-[#FF493C] hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-20"
          >
            {creatingPrivateGame ? (
              <VscLoading className="animate-spin" />
            ) : (
              "START OPERATION"
            )}
          </button>
        </div>

        {isListSelectorOpen && (
          <WordListSelector
            selectedLists={selectedLists}
            onSelect={handleChooseWordList}
            onClose={() => setIsListSelectorOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CreatePrivateLobbyModal;
