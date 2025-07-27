import { useChatStore } from "../Store/useChatStore";
import Sidebar from "../Components/Sidebar";
import NoChatSelected from "../Components/NoChatSelected";
import ChatContainer from "../Components/ChatContainer";
import { useVideoCallStore } from "../Store/useVideoCallStore";
import VideoCallView from "../Components/VideoCall/VideoCallView";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { isCallActive } = useVideoCallStore();

  return (
    <div className="h-screen bg-base-200">
      {isCallActive ? (
        <VideoCallView />
      ) : (
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
            {/* The main flex container for the chat layout */}
            <div className="flex h-full rounded-lg overflow-hidden">
              {/* --- UPDATED SIDEBAR WRAPPER --- */}
              {/* On screens LARGER than 'lg', it's always a flex container.
                  On screens SMALLER than 'lg', it is HIDDEN if a user is selected.
              */}
              <div
                className={`w-full lg:w-auto ${
                  selectedUser ? "hidden" : "flex"
                } lg:flex`}
              >
                <Sidebar />
              </div>

              {/* --- UPDATED CHAT VIEW WRAPPER --- */}
              {/* On screens LARGER than 'lg', it's always a flex container.
                  On screens SMALLER than 'lg', it is only shown if a user IS selected.
              */}
              <div
                className={`w-full ${selectedUser ? "flex" : "hidden"} lg:flex`}
              >
                {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default HomePage;
