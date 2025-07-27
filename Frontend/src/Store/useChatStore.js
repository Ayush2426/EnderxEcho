import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../Lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // ADDED: State and actions for unread message counts
  unreadCounts: {}, // Format: { userId: count }
  incrementUnreadCount: (userId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      },
    })),
  resetUnreadCount: (userId) =>
    set((state) => {
      const newCounts = { ...state.unreadCounts };
      if (newCounts[userId]) {
        delete newCounts[userId];
      }
      return { unreadCounts: newCounts };
    }),

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    // ADDED: Reset the count when we fetch messages for a user
    get().resetUnreadCount(userId);
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // UPDATED: Renamed from subscribeToMessages to be more accurate
  listenForMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Remove any old listeners to prevent duplicates
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages, incrementUnreadCount } = get();

      // Check if the incoming message is from the currently selected user
      if (selectedUser?._id === newMessage.senderId) {
        // If the chat is open, add the message to the view
        set({ messages: [...messages, newMessage] });
        // NOTE: You would also mark the message as read here via an API call
      } else {
        // If the chat is NOT open, increment the unread count
        toast.success(`New message received!`); // Optional: notify the user
        incrementUnreadCount(newMessage.senderId);
      }
    });
  },

  // UPDATED: Now fetches messages when a user is selected
  // The new, corrected code
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });

    // Only fetch messages if a user is actually selected (not null)
    if (selectedUser) {
      set({ messages: [] }); // Clear previous messages
      get().getMessages(selectedUser._id);
    }
  },
}));
