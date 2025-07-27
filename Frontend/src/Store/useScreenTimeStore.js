import { create } from "zustand";

export const useScreenTimeStore = create((set, get) => ({
  startTime: Date.now(),
  screenTimeInSeconds: 0,

  // Function to update the screen time
  updateScreenTime: () => {
    const now = Date.now();
    const elapsed = Math.floor((now - get().startTime) / 1000);
    set({ screenTimeInSeconds: elapsed });
  },
}));

// Start a timer to update the screen time every second
setInterval(() => {
  useScreenTimeStore.getState().updateScreenTime();
}, 1000);
