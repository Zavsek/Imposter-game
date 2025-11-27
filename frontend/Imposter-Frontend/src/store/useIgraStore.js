import {create} from 'zustand';
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios';

export const useIgraStore = create((set) =>({
    creatingGame: false,
    gameInstance:null,


    createGame: async ()=>{
        try {
            set({creatingGame:true});
             const res = await axiosInstance.post('/ustvari-igro');
             set({gameInstance: res.data})
             toast.success("Uspešno ustvarjena igra")
        } catch (error) {
             console.log("Error in createGame:", error);
        set({gameInstance:null});
        toast.error(error.response.data.message);
        }
        finally{
            set({creatingGame:false})
        }
    }
}))