import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../axios";
import axios from "axios";
import { createGameRequest, privateGameDetails, ApiResponse, ErrorResponse, participant } from "@/interfaces";
import shufflePlayers from "../shufflePlayers";




interface PrivateGameState{
    creatingPrivateGame: boolean;
    gameDetails: privateGameDetails|null;
    finishingGame:boolean;
}

interface PrivateGameActions{
    createGame: (request: createGameRequest) => Promise<privateGameDetails|null>; 
    finishGame: () => Promise<boolean>
    closeGame : () => void;
    shufflePlayers:() => void;
}


export const usePrivateGameStore = create<PrivateGameState & PrivateGameActions>()(
    (set, get)=>({
        creatingPrivateGame:false,
        gameDetails:null,
        finishingGame:false,
        createGame: async (request: createGameRequest): Promise<privateGameDetails|null> =>{
            set({creatingPrivateGame:true})
            try{
                const response = await axiosInstance.post<ApiResponse<privateGameDetails>>("/private-game/", request);
                if (!response.data.data) {
                    toast.error("Server returned success, but game details are missing.");
                    return null;
                }
                
                const createdGame: privateGameDetails = response.data.data
                set({gameDetails:createdGame});
                toast.success(response.data.message || "Game Created Successfully!")
                return createdGame;
                
            } catch(error: unknown) {
                if (axios.isAxiosError(error) && error.response) {
                    
                    const status = error.response.status;
                    const errorData = error.response.data as ErrorResponse;
                    const errorMessage = errorData?.message || `Server Error (Status: ${status})`;

                    if (status === 400) {
                        toast.error(`Invalid Request: ${errorMessage}`);
                    } else if (status === 404) {
                       
                        toast.error(`Resource Not Found: ${errorMessage}`);
                    } else {
                        toast.error(`A critical error occurred: ${errorMessage}`);
                    }
                } else {
                    toast.error("An unexpected network error occurred.");
                }
                return null;
            } finally{
                set({creatingPrivateGame : false});
            }
        },

       
      
    finishGame: async (): Promise<boolean> => {
        set({ finishingGame: true });
        const currentState = get();
        const gameId = currentState.gameDetails?.id;
    
        if (!gameId) {
            toast.error("Error: Cannot finish game. Game ID is missing.");
            set({ finishingGame: false });
            return false;
        }
        
        try {
            const finishRequestTime = new Date().toISOString(); 
            const response = await axiosInstance.put<ApiResponse<null>>(`/private-game/${gameId}`, finishRequestTime, {
                headers: { 'Content-Type': 'application/json' }
            });
            return true;
            
        } catch (error: unknown) {

            return false;
        } finally {
            set({ finishingGame: false });
        }
},
        
        shufflePlayers:  () =>{
            const currentState= get();
            if(currentState.gameDetails){
                const shuffledPlayers= shufflePlayers(currentState.gameDetails.participants)
                set({gameDetails:{
                    ...currentState.gameDetails,
                    participants:shuffledPlayers
                }
            })
            }
            else{
                console.warn("Game details are not present in usePrivateGameStore")
            }
        },
        closeGame: () =>{
            set({gameDetails:null});    
            toast("Game state cleared locally.", {icon: '🗑️'});
        }
    })
);