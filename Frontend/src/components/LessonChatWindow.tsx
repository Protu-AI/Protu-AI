import React, { useState, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "@/features/chat/types";
import { ChatInputContainer } from "@/features/chat/components/chat-messages/input/ChatInputContainer";
import { ChatMessages } from "@/features/chat/components/chat-messages/ChatMessages";
import { config } from "../../config";

interface LessonChatWindowProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userName: string;
}

export function LessonChatWindow({
  isOpen,
  setIsOpen,
  userName,
}: LessonChatWindowProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const {
    handleSendMessage: sendMessage,
    currentSessionId,
    handleNewChat,
    sessions,
  } = useChat();

  // Fetch messages when currentSessionId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentSessionId) {
        setMessages([]);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found in local storage");
        }

        const response = await fetch(
          `${config.apiUrl}/v1/chats/single/${currentSessionId}?page=1&limit=20`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        const fetchedMessages: Message[] = data.data.messages.map(
          (msg: any) => ({
            id: msg.id,
            content: msg.content,
            role: msg.senderRole === "user" ? "user" : "assistant",
            timestamp: new Date(msg.createdAt),
            attachment: msg.attachmentName
              ? {
                  name: msg.attachmentName,
                  type: msg.attachments?.[0]?.fileType || "file",
                }
              : undefined,
          })
        );

        setMessages(fetchedMessages.reverse());
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentSessionId]);

  const handleSendMessage = async (content: string, file?: File) => {
    if (!content.trim() && !file) return;

    setIsTyping(true);

    // Add user message to local state immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
      attachment: file ? { name: file.name, type: file.type } : undefined,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Ensure we have an active session
      if (!currentSessionId) {
        await handleNewChat();
        return;
      }

      // Send message via context (which makes the API call)
      const response = await sendMessage(content, file);

      if (response && response.data) {
        // Add assistant response to local state
        const botMessage: Message = {
          id: response.data.aiMessage.id,
          content: response.data.aiMessage.content,
          role: "assistant",
          timestamp: new Date(response.data.aiMessage.createdAt),
          attachment: response.data.aiMessage.attachmentName
            ? {
                name: response.data.aiMessage.attachmentName,
                type:
                  response.data.aiMessage.attachments[0]?.fileType || "file",
              }
            : undefined,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message to local state
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Failed to get response. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="w-[592px] h-[calc(100%-32px)] bg-[#EFE9FC] dark:bg-[#BFA7F3]/80 rounded-[32px] shadow-[0px_2px_6px_rgba(0,0,0,0.2)] p-[32px] mr-[128px] flex flex-col relative transition-colors duration-1000"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#5F24E0]/10 transition-colors"
          >
            <X className="w-5 h-5 text-[#5F24E0]" />
          </button>

          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center flex-grow pt-[32px]">
                <div className="w-[80px] h-[80px] rounded-full bg-[#5F24E0] flex items-center justify-center mb-[32px]">
                  <MessageCircle className="w-[40px] h-[40px] text-[#FFBF00]" />
                </div>
                <p className="font-['Archivo'] text-[18px] font-normal text-[#ABABAB] dark:text-[#EFE9FC] text-center mb-[3px] transition-colors duration-1000">
                  Welcome, {userName}!
                </p>
                <h2 className="font-['Archivo'] text-[32px] font-semibold text-[#5F24E0] dark:text-[#BFA7F3] text-center transition-colors duration-1000">
                  What can I help with?
                </h2>
              </div>
            ) : (
              <ScrollArea className="flex-1 pt-[24px] pb-[24px]">
                <div className="flex flex-col space-y-6">
                  <ChatMessages messages={messages} isTyping={isTyping} />
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Input Area */}
          <div className="flex-none mt-[32px]">
            <ChatInputContainer
              onSendMessage={handleSendMessage}
              isExpanded={isTyping}
              className="w-full"
              allowFileUpload={true}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
