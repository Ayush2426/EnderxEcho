import { useChatStore } from "../Store/useChatStore";
import Sidebar from "../Components/Sidebar";
import NoChatSelected from "../Components/NoChatSelected";
import ChatContainer from "../Components/ChatContainer";

// ADDED: Imports for the video call feature
import { useVideoCallStore } from "../Store/useVideoCallStore";
import VideoCallView from "../Components/VideoCall/VideoCallView";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  // ADDED: Get the call status from the video call store
  const { isCallActive } = useVideoCallStore();

  return (
    <div className="h-screen bg-base-200">
      {/* UPDATED: Conditionally render based on call status */}
      {isCallActive ? (
        // If a call is active, show the video view
        <VideoCallView />
      ) : (
        // Otherwise, show the normal chat interface
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
              <Sidebar />
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default HomePage;
