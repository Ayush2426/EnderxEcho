import { create } from "zustand";
import { axiosInstance } from "../Lib/axios.js"; 
export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/check-auth");
            set({authUser:res.data})
        } catch (error) {
            console.error("Error checking auth:", error);
            set({authUser: null});
        }finally{
            set({isCheckingAuth: false})
        }
    }

    // signup: async(fullName, email, password) => {
    //     try {
            
    //     } catch (error) {
            
    //     }
    // }

}));