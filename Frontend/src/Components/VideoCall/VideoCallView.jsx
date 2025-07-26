import { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useVideoCallStore } from "../../Store/useVideoCallStore";
import { useAuthStore } from "../../Store/useAuthStore";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { useChatStore } from "../../Store/useChatStore";

// IMPORTANT: Add your Agora App ID here
const APP_ID = import.meta.env.VITE_AGORA_APP_ID;

const VideoCallView = () => {
  const { channelName, agoraToken, endCall } = useVideoCallStore();
  const { authUser, socket } = useAuthStore();
  const { selectedUser } = useChatStore();

  // Refs to hold the Agora client and tracks without causing re-renders
  const rtcClient = useRef(null);
  const localAudioTrack = useRef(null);
  const localVideoTrack = useRef(null);

  // State for UI controls
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  useEffect(() => {
    // Initialize the Agora client
    rtcClient.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // --- Event Listeners for the remote user ---
    const handleUserPublished = async (user, mediaType) => {
      await rtcClient.current.subscribe(user, mediaType);
      if (mediaType === "video") {
        const remoteVideoTrack = user.videoTrack;
        remoteVideoTrack.play("remote-player");
      }
      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
    };

    const handleUserLeft = () => {
      // Clean up remote user's video
      document.getElementById("remote-player").innerHTML = "";
    };

    // --- Main Call Logic ---
    const joinChannel = async () => {
      rtcClient.current.on("user-published", handleUserPublished);
      rtcClient.current.on("user-left", handleUserLeft);

      await rtcClient.current.join(
        APP_ID,
        channelName,
        agoraToken,
        authUser._id
      );

      // Create and publish local camera and microphone tracks
      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
      localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();

      localVideoTrack.current.play("local-player");
      await rtcClient.current.publish([
        localAudioTrack.current,
        localVideoTrack.current,
      ]);
    };

    joinChannel();

    // --- Cleanup Function ---
    // This is crucial to release the camera/mic when the component unmounts
    return () => {
      localAudioTrack.current?.close();
      localVideoTrack.current?.close();
      rtcClient.current?.leave();
    };
  }, [APP_ID, channelName, agoraToken, authUser._id]);

  // --- UI Control Functions ---
  const toggleAudio = async () => {
    if (isAudioMuted) {
      await localAudioTrack.current.setMuted(false);
      setIsAudioMuted(false);
    } else {
      await localAudioTrack.current.setMuted(true);
      setIsAudioMuted(true);
    }
  };

  const toggleVideo = async () => {
    if (isVideoMuted) {
      await localVideoTrack.current.setMuted(false);
      setIsVideoMuted(false);
    } else {
      await localVideoTrack.current.setMuted(true);
      setIsVideoMuted(true);
    }
  };

  const handleEndCall = () => {
    // Tell the other user the call has ended
    socket.emit("call-ended", { to: selectedUser._id });
    // Update our own state to end the call
    endCall();
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Remote User's Video (takes up the full screen) */}
      <div id="remote-player" className="w-full h-full"></div>

      {/* Local User's Video (small, in the corner) */}
      <div
        id="local-player"
        className="absolute top-4 right-4 w-48 h-36 border-2 border-gray-500 rounded-lg"
      ></div>

      {/* Call Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
        <button onClick={toggleAudio} className="btn btn-circle glass">
          {isAudioMuted ? <MicOff /> : <Mic />}
        </button>
        <button onClick={toggleVideo} className="btn btn-circle glass">
          {isVideoMuted ? <VideoOff /> : <Video />}
        </button>
        <button onClick={handleEndCall} className="btn btn-circle btn-error">
          <PhoneOff />
        </button>
      </div>
    </div>
  );
};

export default VideoCallView;
