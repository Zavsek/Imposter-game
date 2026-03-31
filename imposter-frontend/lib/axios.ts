import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
  timeout:10000,
  headers: {
        'Content-Type': 'application/json',
    },
});


axiosInstance.interceptors.request.use(
    (config) => {
        let token = null;
        if (typeof window !== 'undefined') {
            const storageItem = localStorage.getItem("imposter-auth-storage");
            
            if (storageItem) {
                try {
                    const parsedStorage = JSON.parse(storageItem);

                    token = parsedStorage.state?.jwtToken; 
                } catch (error) {
                    console.error("[AXIOS ERROR] Error parsing auth token from storage:", error);
                }
            }
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("-----------------------------------------");
            console.log("[AXIOS] JWT Token successfully attached.");
        } else {
            console.log("-----------------------------------------");
            console.warn("[AXIOS] No JWT Token found in storage. Request will be unauthenticated.");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);