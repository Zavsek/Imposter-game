import {create} from 'zustand';
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios';


export const useIgralecStore = create((set) =>({
    checkingUser:true,
    creatingUser: false,
    userInstance:null,

    checkUser: async () =>{
  try{
        const res = await axiosInstance.get('/igralec/check');
        console.log("CHECK RESPONSE:", res);
        set({userInstance:res.data});
    }
    catch(error){
        console.log("Error in checkAuth:", error);
        set({userInstance:null});
    }
    finally{
        set({checkingUser: false});
    }
    }, 
    createUser: async (data = null)=>{
        try {
            set({creatingUser:true});
            const response = await axiosInstance.post('/igralec/ustvari-igralca', data)
            set({userInstance: response.data})
            toast.success("Uspešno ustvarjen uporabnik");
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({creatingUser:false});
        }
    }
}))