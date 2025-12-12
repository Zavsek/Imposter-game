import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";
import { isTokenExpired } from "../isTokenExpired";
import { axiosInstance } from "../axios";
import axios from "axios";
import { loginRequest, loginResponse, registerRequest, ApiResponse } from "@/interfaces";


interface AuthState {
  checkingAuth: boolean;
  registering: boolean;
  playerId: number | null;
  username: string | null;
  jwtToken: string | null;
  createdAt: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

interface AuthActions {
  login: (request: loginRequest) => void;
  logout: () => void;
  register: (request: registerRequest) => Promise<boolean>;
  setHydrated: () => void;
  checkAuthOnAppLoad: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      checkingAuth: false,
      registering: false,
      playerId: null,
      username: null,
      jwtToken: null,
      isAuthenticated: false,
      isHydrated: false,
      createdAt: null,

      login: async (request: loginRequest) => {
        set({ checkingAuth: true });
        try {
          const response = await axiosInstance.post<ApiResponse<loginResponse>>(
            "/users/login",
            request
          );
          const { id, username, token, createdAt } = response.data.data;
          set({
            playerId: id,
            username: username,
            jwtToken: token,
            createdAt: createdAt,
            isAuthenticated: true,
          });
          toast.success("Succesfully signed In ");
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 401) {
              toast.error("invalid login credentials.");
            } else {
              toast.error(
                `An error occured while logging in: ${error.response.status}`
              );
            }
          } else {
            toast.error("An unexpected error occured.");
          }
        } finally {
          set({ checkingAuth: false });
        }
      },

      logout: () =>
        set({
          playerId: null,
          username: null,
          jwtToken: null,
          isAuthenticated: false,
        }),
        //return type of boolean to tell the program if it needs to redirect to login
      register: async (request: registerRequest): Promise<boolean> => {
        set({ registering: true });
        try {
          const response = await axiosInstance.post("/users/register", request);
          toast.success("succesfully registered. Please sign in!");
          return true;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 409) {
              toast.error("A user With this email already exists.");
              return false;
            } else {
              toast.error(`Error in registration: ${error.response.status}`);
              return false;
            }
          } else {
            toast.error("Unexpected network error.");
            return false;
          }
        } finally {
          set({ registering: false });
        }
      },

      setHydrated: () => set({ isHydrated: true }),

      checkAuthOnAppLoad: async(): Promise<boolean> => {
        const state = get();
        if (state.jwtToken && !isTokenExpired(state.jwtToken)) {
          set({ isAuthenticated: true });
          return true;
        } else {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: "imposter-auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Error in hidration:", error);
          return;
        }

        state?.checkAuthOnAppLoad();

        state?.setHydrated();
      },
      partialize: (state) => ({
        playerId: state.playerId,
        username: state.username,
        jwtToken: state.jwtToken,
      }),
    }
  )
);
