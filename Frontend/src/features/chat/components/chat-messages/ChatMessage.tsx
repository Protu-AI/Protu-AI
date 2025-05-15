import { Message } from "../../types";
import { cn } from "@/lib/utils";
import { Sparkles, Paperclip } from "lucide-react"; // Import Paperclip for the attachment symbol
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown for rendering markdown content

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "assistant";

  // Check if the message has an attachment
  const hasAttachment = message.attachment && message.attachment.name;

  return (
    <div className={cn("flex w-full", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <div className="mr-[22px] shrink-0 self-start mt-1">
          <div className="h-10 w-10 rounded-full border border-[#A6B5BB] dark:border-[#BFA7F3] flex items-center justify-center bg-transparent p-[9px] transition-colors duration-1000">
            <Sparkles className="h-full w-full text-[#5F24E0] dark:text-[#EFE9FC] transition-colors duration-1000" />
          </div>
        </div>
      )}
      <div
        className={cn(
          "font-['Archivo'] text-[22px] font-normal text-[#1C0B43] dark:text-[#EFE9FC] self-start transition-colors duration-1000",
          isBot
            ? "max-w-[600px]"
            : cn(
                "bg-white dark:bg-[#BFA7F3]/80 rounded-2xl p-[12px]", // Added bg-white and p-[12px]
                "text-left max-w-[600px]"
              )
        )}
      >
        {/* Message content */}
        <ReactMarkdown>{message.content}</ReactMarkdown>

        {/* Display attachment if it exists */}
        {hasAttachment && (
          <div className="flex items-center mt-2">
            <Paperclip className="h-4 w-4 text-[#5F24E0] dark:text-[#EFE9FC] mr-2" />{" "}
            {/* Attachment symbol */}
            <span className="text-sm text-[#5F24E0] dark:text-[#EFE9FC]">
              {message.attachment?.name} {/* File name */}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
