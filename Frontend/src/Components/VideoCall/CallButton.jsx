import { Video } from "lucide-react";
import { useAuthStore } from "../../Store/useAuthStore";
import { useChatStore } from "../../Store/useChatStore";
import { useVideoCallStore } from "../../Store/useVideoCallStore";
import toast from "react-hot-toast";

const CallButton = () => {
  const { authUser, socket } = useAuthStore();
  const { selectedUser } = useChatStore();
  const { startMakingCall } = useVideoCallStore();

  const handleCallUser = () => {
    if (!selectedUser) return;

    // Create a unique channel name by combining user IDs
    // This ensures only these two users will be in the call
    const channelName = [authUser._id, selectedUser._id].sort().join("-");

    // Update our own state to show we are "making a call"
    startMakingCall(channelName);
    toast.success(`Calling ${selectedUser.fullName}...`);

    // Emit the event to the server to "ring" the other user
    socket.emit("outgoing-call", {
      to: selectedUser._id,
      from: authUser._id,
      callerName: authUser.fullName,
      channelName: channelName,
    });
  };

  return (
    <button onClick={handleCallUser} className="btn btn-ghost btn-circle">
      <Video className="w-6 h-6" />
    </button>
  );
};

export default CallButton;
