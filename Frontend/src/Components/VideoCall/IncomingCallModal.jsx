import toast from "react-hot-toast";
import { axiosInstance } from "../../Lib/axios";
import { useAuthStore } from "../../Store/useAuthStore";
import { useVideoCallStore } from "../../Store/useVideoCallStore";
import { Phone, X } from "lucide-react";

const IncomingCallModal = () => {
  const { callerInfo, acceptCall, rejectCall } = useVideoCallStore();
  const { socket } = useAuthStore();

  const handleAcceptCall = async () => {
    try {
      // Fetch a token to join the call
      const res = await axiosInstance.get(
        `/agora/token?channelName=${callerInfo.channelName}`
      );
      const token = res.data.token;

      // Update our state to join the call
      acceptCall(token);

      // Tell the original caller that we have accepted
      socket.emit("call-accepted", { to: callerInfo.from });
    } catch (error) {
      toast.error("Failed to accept call. Please try again.");
      handleRejectCall(); // Reject the call if token fetching fails
    }
  };

  const handleRejectCall = () => {
    // Tell the original caller we rejected the call
    socket.emit("call-rejected", { to: callerInfo.from });
    // Update our own state
    rejectCall();
  };

  if (!callerInfo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-200 p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-2">Incoming Call</h2>
        <p className="text-lg mb-6">
          <span className="font-bold text-primary">
            {callerInfo.callerName}
          </span>{" "}
          is calling you.
        </p>
        <div className="flex justify-center gap-6">
          <button
            onClick={handleRejectCall}
            className="btn btn-circle btn-error text-white"
          >
            <X size={28} />
          </button>
          <button
            onClick={handleAcceptCall}
            className="btn btn-circle btn-success text-white"
          >
            <Phone size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
