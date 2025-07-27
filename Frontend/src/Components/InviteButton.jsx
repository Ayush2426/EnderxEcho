import React from "react";
import toast from "react-hot-toast";
import { Link } from "lucide-react"; // For the icon

const InviteButton = () => {
  const handleCopyLink = (e) => {
    // --- Ripple Effect Logic (from before) ---
    const ripple = document.createElement("span");
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple");
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    // --- End Ripple Effect Logic ---

    // --- Clipboard and Toast Logic ---
    const linkToCopy = "https://enderxecho.onrender.com/signup";
    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => {
        toast.success("Link Copied to Clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy link.");
        console.error("Failed to copy link: ", err);
      });
  };

  return (
    <>
      <style jsx="true">{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-animation 600ms linear;
          background-color: rgba(255, 255, 255, 0.7);
        }
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>

      <button
        onClick={handleCopyLink}
        className={`
          relative overflow-hidden rounded-lg px-3 py-1.5 font-bold text-white
          flex items-center gap-2
          cursor-pointer
          bg-gradient-to-r from-purple-700 via-white-500 to-blue-500
          bg-[size:200%] bg-[position:0%]
          transition-all duration-300 ease-out
          hover:shadow-md hover:shadow-blue-300/50
          hover:scale-110
          hover:bg-[position:100%]
          active:scale-100
        `}
      >
        <Link size={20} />
        <span>Invite</span>
      </button>
    </>
  );
};

export default InviteButton;
