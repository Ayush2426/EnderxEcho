import { create } from "zustand";

export const useVideoCallStore = create((set, get) => ({
  isReceivingCall: false,
  isMakingCall: false,
  isCallActive: false,
  callerInfo: null, // Will hold { from, channelName, callerName }
  channelName: null,
  agoraToken: null,

  startReceivingCall: (callerInfo) =>
    set({ isReceivingCall: true, callerInfo }),

  startMakingCall: (channelName) => set({ isMakingCall: true, channelName }),

  acceptCall: (token) =>
    set({
      isReceivingCall: false,
      isMakingCall: false,
      isCallActive: true,
      agoraToken: token,
      channelName: get().callerInfo.channelName,
    }),

  startAcceptedCall: (token, channelName) =>
    set({
      isMakingCall: false,
      isCallActive: true,
      agoraToken: token,
      channelName: channelName,
    }),

  rejectCall: () =>
    set({
      isReceivingCall: false,
      isMakingCall: false,
      callerInfo: null,
      channelName: null,
    }),

  endCall: () =>
    set({
      isReceivingCall: false,
      isMakingCall: false,
      isCallActive: false,
      callerInfo: null,
      channelName: null,
      agoraToken: null,
    }),
}));
