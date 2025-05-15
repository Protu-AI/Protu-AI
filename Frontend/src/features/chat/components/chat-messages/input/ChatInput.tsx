import { FileText, SendHorizontal } from "lucide-react";
import { useState, KeyboardEvent, ChangeEvent, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (content: string, file: File | null) => void; // Updated to accept file
  disabled?: boolean;
  className?: string;
}

export function ChatInput({
  onSendMessage,
  disabled,
  className,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null); // State to store the selected file
  const [isHoveringDoc, setIsHoveringDoc] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() || file) {
      onSendMessage(message, file); // Pass both message and file
      setMessage("");
      setFile(null); // Clear the file after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = "72px";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "72px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile); // Store the selected file in state
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "72px";
    }
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the file input
      />
      {/* File icon button */}
      <button
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-6 w-6"
        onMouseEnter={() => setIsHoveringDoc(true)}
        onMouseLeave={() => setIsHoveringDoc(false)}
        onClick={handleFileClick} // Add onClick handler
      >
        <FileText
          className={cn(
            "h-full w-full transition-colors",
            isHoveringDoc
              ? "text-[#5F24E0] dark:text-[#FFBF00]"
              : "text-[#A6B5BB] dark:text-[#EFE9FC]"
          )}
        />
      </button>
      {/* Send message button */}
      <button
        className={cn(
          "absolute right-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-6 w-6",
          message.trim() || file ? "cursor-pointer" : "cursor-default" // Enable button if message or file exists
        )}
        onClick={message.trim() || file ? handleSend : undefined}
      >
        <SendHorizontal
          className={cn(
            "h-full w-full transition-colors",
            message.trim() || file
              ? "text-[#5F24E0] dark:text-[#FFBF00]"
              : "text-[#A6B5BB] dark:text-[#EFE9FC]"
          )}
        />
      </button>
      {/* Textarea for message input */}
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Message to protu"
        rows={1}
        className="min-h-[72px] w-full resize-none rounded-[24px] border border-[#A6B5BB] dark:border-[#BFA7F3] bg-background dark:bg-[#BFA7F3]/80 px-[72px] py-[27px] font-['Archivo'] text-base font-normal leading-[18px] text-[#A6B5BB] dark:text-[#EFE9FC] placeholder:text-[#A6B5BB] dark:placeholder:text-[#EFE9FC] focus:border-[#5F24E0] dark:focus:border-[#FFBF00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-in-out overflow-hidden"
        disabled={disabled}
      />
      {/* Display selected file name */}
      {file && (
        <div className="absolute bottom-16 left-6 text-sm text-[#5F24E0] dark:text-[#FFBF00]">
          Selected file: {file.name}
        </div>
      )}
    </div>
  );
}
