import { create } from "zustand";
import { axiosInstance } from "../Lib/axios"; // Adjust path if needed

export const useVisitStore = create((set, get) => ({
  visitLogged: false,
  logVisit: async () => {
    // Only log the visit once per session
    if (get().visitLogged) return;
    
    try {
      await axiosInstance.post("/stats/visit");
      set({ visitLogged: true });
    } catch (error) {
      console.error("Failed to log visit", error);
    }
  },
}));