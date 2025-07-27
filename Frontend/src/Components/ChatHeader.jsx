import { X, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../Store/useAuthStore";
import { useChatStore } from "../Store/useChatStore";
import CallButton from "./VideoCall/CallButton";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back button: ONLY visible on screens smaller than lg */}
          <button
            className="lg:hidden btn btn-ghost btn-circle"
            onClick={() => setSelectedUser(null)}
          >
            <ArrowLeft />
          </button>

          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CallButton />
          {/* Close button: ONLY visible on screens lg and larger */}
          <button
            className="hidden lg:block btn btn-ghost btn-circle"
            onClick={() => setSelectedUser(null)}
          >
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
