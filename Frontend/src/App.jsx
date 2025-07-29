import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import SettingsPage from "./Pages/SettingsPage";
import ProfilePage from "./Pages/ProfilePage";
import StatsPage from "./Pages/StatPage.jsx";
import { useVisitStore } from "./Store/useVisitStore.js";
import PushNotificationManager from "./Components/PushNotificationManager.jsx";

import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./Store/useAuthStore.js";
import { useThemeStore } from "./Store/useThemeStore.js";
import { useChatStore } from "./Store/useChatStore.js";
import { Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// --- AGORA IMPORTS ---
import { useVideoCallStore } from "./Store/useVideoCallStore.js";
import { axiosInstance } from "./Lib/axios.js";
import IncomingCallModal from "./Components/VideoCall/IncomingCallModal.jsx";
import FeedbackPage from "./Components/FeedbackPage.jsx";
// --- END AGORA IMPORTS ---

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, socket } = useAuthStore();
  const { theme } = useThemeStore();
  const listenForMessages = useChatStore((state) => state.listenForMessages);

  const logVisit = useVisitStore((state) => state.logVisit);

  useEffect(() => {
    logVisit();
  }, [logVisit]);

  // --- AGORA HOOKS ---
  const {
    isReceivingCall,
    startReceivingCall,
    startAcceptedCall,
    rejectCall,
    endCall,
  } = useVideoCallStore();
  // --- END AGORA HOOKS ---

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      listenForMessages();
    }
  }, [authUser, listenForMessages]);

  // --- AGORA EFFECT ---
  // This new useEffect hook handles all real-time video call events
  useEffect(() => {
    if (socket) {
      socket.on("incoming-call", ({ from, channelName, callerName }) => {
        toast.success(`${callerName} is calling...`);
        startReceivingCall({ from, channelName, callerName });
      });

      socket.on("call-accepted", async () => {
        const channelName = useVideoCallStore.getState().channelName;
        try {
          const res = await axiosInstance.get(
            `/agora/token?channelName=${channelName}`
          );
          startAcceptedCall(res.data.token, channelName);
        } catch (error) {
          toast.error("Failed to start call. Please try again.");
          rejectCall();
        }
      });

      socket.on("call-rejected", () => {
        toast.error("Call Rejected");
        rejectCall();
      });

      socket.on("call-ended", () => {
        toast.info("Call Ended");
        endCall();
      });

      return () => {
        socket.off("incoming-call");
        socket.off("call-accepted");
        socket.off("call-rejected");
        socket.off("call-ended");
      };
    }
  }, [socket, startReceivingCall, startAcceptedCall, rejectCall, endCall]);
  // --- END AGORA EFFECT ---

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      {/* --- AGORA UI --- */}
      {/* This renders the incoming call pop-up over any page */}
      {isReceivingCall && <IncomingCallModal />}
      {/* --- END AGORA UI --- */}
      {/* Push Notification renderer */}
      {authUser && <PushNotificationManager />}

      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/stats"
          element={authUser ? <StatsPage /> : <Navigate to="/login" />}
        />
        <Route path="/feedback" element={<FeedbackPage/>}/>
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
