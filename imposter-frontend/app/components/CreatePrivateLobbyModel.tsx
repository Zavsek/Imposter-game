'use client'

import React, { useState, useEffect } from 'react'
import { VscLoading, VscAdd, VscClose, VscChevronRight } from "react-icons/vsc"
import { FaTrashAlt, FaLock } from "react-icons/fa";
import { usePrivateGameStore } from '@/lib/store/usePrivateGameStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createGameRequest } from '@/interfaces';


import { PRESET_WORD_LISTS } from '@/lib/wordlists'; 
const CUSTOM_LIST_NAME = "Custom Word";


const MIN_PLAYERS = 3;
const MAX_PLAYERS = 16;
const MAX_IMPOSTERS = 4;


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreatePrivateLobbyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    
    const { username: hostUsername, playerId: hostId } = useAuthStore();
    const { createGame, creatingPrivateGame, gameDetails } = usePrivateGameStore();
    const router = useRouter();


    const [players, setPlayers] = useState<string[]>([hostUsername || 'Host']); 
    const [newName, setNewName] = useState('');
    const [word, setWord] = useState('');
    const [imposterHint, setImposterHint] = useState('');
    const [numOfImposters, setNumOfImposters] = useState(1);


    const [isListSelectorOpen, setIsListSelectorOpen] = useState(false);

    const [activeListName, setActiveListName] = useState(PRESET_WORD_LISTS[0]?.name || CUSTOM_LIST_NAME);



    useEffect(() => {
        if (isOpen) {
            setPlayers([hostUsername || 'Host']);
            setNewName('');
            
     
            if (PRESET_WORD_LISTS.length > 0 && PRESET_WORD_LISTS[0].name !== CUSTOM_LIST_NAME) {
                 handleChooseWordList(PRESET_WORD_LISTS[0].name, true); 
            } else {
                 handleChooseWordList(CUSTOM_LIST_NAME, true);
            }
        }
    }, [isOpen, hostUsername]);


    const maxPossibleImposters = Math.min(MAX_IMPOSTERS, Math.floor(players.length / 2));
    if (numOfImposters > maxPossibleImposters && players.length > 0) {
        setNumOfImposters(maxPossibleImposters); 
    }
    
    if (!isOpen) return null;


    const handleAddPlayer = () => {
        const trimmedName = newName.trim();
        if (!trimmedName || players.length >= MAX_PLAYERS) {
            toast.error(`Max players reached (${MAX_PLAYERS}) or name is empty.`);
            return;
        }
        if (players.map(p => p.toLowerCase()).includes(trimmedName.toLowerCase())) {
             toast.error("Name already exists.");
             return;
        }
        
        setPlayers([...players, trimmedName]);
        setNewName('');
    };

    const handleRemovePlayer = (name: string) => {
        if (name === hostUsername) {
            toast.error("Cannot remove the host.");
            return;
        }
        setPlayers(players.filter(p => p !== name));
    };




    const handleChooseWordList = (listName: string, silent = false) => {
        setActiveListName(listName);
        setIsListSelectorOpen(false);
        
        if (listName === CUSTOM_LIST_NAME) {
            setWord('');
            setImposterHint('');
            return;
        }

        const list = PRESET_WORD_LISTS.find(l => l.name === listName);
        
        if (list && list.items.length > 0) {

            const randomIndex = Math.floor(Math.random() * list.items.length);
            const { word: chosenWord, hint: chosenHint } = list.items[randomIndex];
            
            setWord(chosenWord);
            setImposterHint(chosenHint);
            
            if (!silent) toast.success(`Word chosen: "${chosenWord}" from list "${listName}".`);
        } else {
            toast.error("Selected list is empty or not found.");
            handleChooseWordList(CUSTOM_LIST_NAME, true);
        }
    };



    const handleSubmit = async () => {
        if (!hostId) {
             toast.error("Host ID not found. Please re-login.");
             return;
        }
        if (players.length < MIN_PLAYERS) {
             toast.error(`Need at least ${MIN_PLAYERS} players to start.`);
             return;
        }
        if (!word.trim()) {
             toast.error("The secret word is required.");
             return;
        }

        const request: createGameRequest = {
            hostId: hostId, 
            names: players,
            numOfImposters: numOfImposters,
            word: word.trim(),
            imposterHint: imposterHint.trim(), 
        };

        const success = await createGame(request);

        if (success && gameDetails) {
            onClose(); 
            router.push(`/lobby/${gameDetails.id}`); 
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="glass-card2 w-full max-w-4xl h-[90vh] md:h-[80vh] bg-black/80 backdrop-blur-md border-4 border-white/90 shadow-2xl p-8 flex flex-col relative overflow-hidden text-white rounded-xl">
        
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-[#FF493C] transition"
                    disabled={creatingPrivateGame}
                >
                    <VscClose size={24} />
                </button>

                <h1 className="text-3xl text-white font-secondary font-bold tracking-wider mb-8 border-b border-white/20 pb-2 flex items-center gap-3">
                    <FaLock /> NEW PRIVATE OPERATION
                </h1>

                {/* --- GRID (2 Columns: Setup | Players) --- */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto pr-2">
                    
                    {/* LEFT SIDE */}
                    <div className="md:col-span-1 flex flex-col gap-5 border-r border-white/10 md:pr-4">
                        <h3 className="text-xl font-secondary text-[#FF493C] mb-2 border-b border-[#FF493C]/50 pb-1">Game Parameters</h3>
                        
                        {/* 1. SECRET WORD */}
                        <div className="flex flex-col">
                            <label className="text-sm text-white/70 font-primary mb-1 flex justify-between items-center">
                                <span>Secret Word / Topic:</span>
                                <button
                                    onClick={() => setIsListSelectorOpen(true)}
                                    className="text-xs text-[#FF493C] hover:text-white/90 border border-[#FF493C]/50 px-2 py-1 rounded transition disabled:opacity-50"
                                    disabled={creatingPrivateGame}
                                >
                                    {activeListName === CUSTOM_LIST_NAME ? 'Custom Input' : `Change List (${activeListName})`} 
                                </button>
                            </label>
                            <input 
                                className="border-2 border-white/90 bg-black/60 text-white/90 rounded-sm p-2 w-full font-primary focus:outline-none focus:border-[#FF493C] transition-colors"
                                value={word}
                                onChange={(e) => {

                                     if (activeListName !== CUSTOM_LIST_NAME) setActiveListName(CUSTOM_LIST_NAME);
                                     setWord(e.target.value);
                                }}
                                placeholder={activeListName === CUSTOM_LIST_NAME ? "Enter secret word manually" : `Randomly chosen from ${activeListName}`}
                                disabled={creatingPrivateGame}
                            />
                        </div>

                         {/* 2. IMPOSTER HINT */}
                         <div className="flex flex-col">
                             <label className="text-sm text-white/70 font-primary mb-1">Imposter Hint (Optional):</label>
                              <input 
                                  className="border-2 border-white/90 bg-black/60 text-white/90 rounded-sm p-2 w-full font-primary focus:outline-none focus:border-[#FF493C] transition-colors"
                                  value={imposterHint}
                                  onChange={(e) => {

                                       if (activeListName !== CUSTOM_LIST_NAME) setActiveListName(CUSTOM_LIST_NAME);
                                       setImposterHint(e.target.value);
                                  }}
                                  placeholder="A subtle clue for the Imposter"
                                  disabled={creatingPrivateGame}
                              />
                         </div>

                         {/* 3. NUMBER OF IMPOSTERS */}
                         <div className="flex flex-col">
                             <label className="text-sm text-white/70 font-primary mb-2">Number of Imposters:</label>
                             <div className='grid grid-cols-4 gap-3'> 
                                 {[1, 2, 3, 4].map((number) => {
                                     
                                     const isSelectable = number <= maxPossibleImposters;
                                     const isSelected = number === numOfImposters;

                                     return (
                                         <button
                                             key={number}
                                             onClick={() => {
                                                 if (isSelectable) {
                                                     setNumOfImposters(number);
                                                 }
                                             }}
                                             disabled={!isSelectable || creatingPrivateGame} 
                                             
                                             className={`
                                                 w-full aspect-square flex items-center justify-center
                                                 rounded-md text-xl font-bold science-gothic transition-all duration-200
                                                 border-2 
                                                 
                                                 ${isSelectable ? 
                                                     (isSelected 
                                                         ? 'bg-[#FF493C] text-black border-[#FF493C] shadow-[0_0_10px_rgba(255,73,60,0.8)]'
                                                         : 'bg-black/60 text-white/80 border-white/40 hover:bg-black/80 hover:border-white/90' 
                                                     )
                                                     : 'bg-black/30 text-white/20 border-white/10 cursor-not-allowed'
                                                 }
                                             `}
                                         >
                                             {number}
                                         </button>
                                     );
                                 })}
                             </div>
                             <p className="text-xs text-white/50 mt-2">
                                Imposters: {numOfImposters} / Max: {maxPossibleImposters} (Max 4, max half of players).
                             </p>
                         </div>
                    </div>

                    {/* DESNA STRAN: SEZNAM IGRALCEV (2/3 širine) */}
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <h3 className="text-xl font-secondary text-white mb-2 border-b border-white/50 pb-1">
                            Agents / Suspects ({players.length} / {MAX_PLAYERS})
                        </h3>

                        <div className="flex gap-2">
                            <input
                                className="flex-1 border-2 border-white/90 bg-black/60 text-white/90 rounded-sm p-2 font-primary focus:outline-none focus:border-[#FF493C] transition-colors"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddPlayer();
                                }}
                                placeholder="Add Agent's Name"
                                disabled={players.length >= MAX_PLAYERS || creatingPrivateGame}
                            />
                            <button
                                onClick={handleAddPlayer}
                                className="bg-[rgba(0,0,100,0.6)] text-[#FF493C] border-2 border-white p-2 rounded-sm science-gothic hover:bg-[rgba(0,0,150,0.8)] transition disabled:opacity-50"
                                disabled={players.length >= MAX_PLAYERS || creatingPrivateGame}
                            >
                                <VscAdd size={20} />
                            </button>
                        </div>

                 <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border-2 border-black/50 rounded-md p-2">
                            {players.length === 0 ? (
                                <p className="text-white/50 text-center py-4">Add some suspects...</p>
                            ) : (
                                <ul className="space-y-2">
                                    {players.map((name, index) => (
                                        <li key={index} className={`flex justify-between items-center p-2 rounded-sm font-primary text-white/90 ${name === hostUsername ? 'bg-[rgba(13,0,80,0.8)] border border-blue-400/50' : 'bg-black/60'}`}>
                                            <span className="flex items-center gap-2">
                                                <VscChevronRight className="text-[#FF493C]"/>
                                                {name}
                                                {name === hostUsername && <span className="text-xs text-blue-400 ml-2">(Host)</span>}
                                            </span>
                                            <button
                                                onClick={() => handleRemovePlayer(name)}
                                                disabled={name === hostUsername || creatingPrivateGame}
                                                className="text-white/50 hover:text-[#FF493C] transition disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <FaTrashAlt size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- FOOTER / CREATE BUTTON --- */}
                <div className="mt-6 pt-4 border-t border-white/20">
                    <button
                        onClick={handleSubmit}
                        disabled={players.length < MIN_PLAYERS || !word.trim() || creatingPrivateGame}
                        className="w-full py-3 bg-[rgba(0,0,100,0.7)] text-[#FF493C] text-xl font-bold border-2 border-white rounded-md science-gothic hover:bg-[rgba(0,0,150,0.9)] transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {creatingPrivateGame ? <VscLoading className="animate-spin text-2xl" /> : <><FaLock /> INITIATE OPERATION</>}
                    </button>
                    <p className="text-xs text-white/50 mt-2 text-center">Players: {players.length} / Imposters: {numOfImposters}</p>
                </div>

                {/* --- WORD LIST SELECTOR MODAL (Overlay) --- */}
                {isListSelectorOpen && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8">
                        <div className="w-full max-w-md bg-black/90 p-6 rounded-xl border border-white/20 shadow-2xl">
                            <h4 className="text-2xl font-secondary font-bold text-white mb-4 border-b border-white/30 pb-2">
                                Select Word Source
                            </h4>
                            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto custom-scrollbar">
                                
                                {PRESET_WORD_LISTS.map((list) => (
                                    <button
                                        key={list.name}
                                        onClick={() => handleChooseWordList(list.name)}
                                        className={`
                                            w-full text-left p-3 rounded-md transition flex justify-between items-center
                                            ${list.name === activeListName 
                                                ? 'bg-[#FF493C] text-black font-bold'
                                                : 'bg-[rgba(13,0,80,0.7)] text-white/90 hover:bg-[rgba(13,0,100,0.9)]'
                                            }
                                        `}
                                    >
                                        <span>
                                            {list.name} 
                                            {list.name === CUSTOM_LIST_NAME && <span className="text-sm ml-2 opacity-70"> (Manual Input)</span>}
                                            {list.name !== CUSTOM_LIST_NAME && <span className="ml-2 text-xs opacity-80">{list.items.length} words</span>}
                                            {list.name === activeListName && <span className="ml-2 text-xs opacity-80"> (Active)</span>}
                                        </span>
                                        <VscChevronRight />
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsListSelectorOpen(false)}
                                className="w-full mt-6 py-2 bg-[#fa3d2f] text-black font-bold rounded-md hover:bg-[#ff5545] transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreatePrivateLobbyModal;