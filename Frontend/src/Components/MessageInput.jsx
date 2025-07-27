import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../Store/useChatStore";
import { Image, Send, X, Mic } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const { sendMessage } = useChatStore();

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      return; // Silently disable if not supported
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      toast.error(event.error || "Voice input error.");
    };

    recognitionRef.current = recognition;
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      removeImage();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 border-t border-base-300">
      {imagePreview && (
        <div className="mb-3">
          <div className="relative w-20 h-20">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg border border-base-300"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          className="input input-bordered rounded-full w-full"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* UPDATED: Removed 'hidden sm:flex' to make it always visible */}
        <button
          type="button"
          className={`btn btn-circle btn-ghost ${
            imagePreview ? "text-primary" : ""
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={22} />
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* UPDATED: Removed 'hidden sm:flex' to make it always visible */}
        {recognitionRef.current && (
          <button
            type="button"
            className={`btn btn-circle btn-ghost ${
              isListening ? "bg-red-500 text-white" : ""
            }`}
            onClick={handleMicClick}
          >
            <Mic size={22} />
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
