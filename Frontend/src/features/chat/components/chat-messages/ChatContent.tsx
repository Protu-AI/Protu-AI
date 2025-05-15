import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { WelcomeHeader } from "./welcome/WelcomeHeader";
import { ChatInputContainer } from "./input/ChatInputContainer";
import { ChatMessages } from "./ChatMessages";
import { Message } from "../../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { config } from "../../../../../config";

export function ChatContent() {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const { handleSendMessage: sendMessage, currentSessionId } = useChat();

  // Fetch messages when currentSessionId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentSessionId) return; // Skip if no session ID

      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        if (!token) {
          throw new Error("No token found in local storage");
        }

        // Make API request to fetch messages
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

        // Transform API response into Message objects
        const fetchedMessages: Message[] = data.data.messages.map(
          (msg: any) => ({
            id: msg.id,
            content: msg.content,
            role: msg.senderRole === "user" ? "user" : "assistant",
            timestamp: new Date(msg.createdAt),
            attachment: msg.attachmentName
              ? {
                  name: msg.attachmentName,
                  type: msg.attachments?.[0]?.fileType || "file", // Use fileType if available
                }
              : undefined,
          })
        );

        // Update the messages state
        setMessages(fetchedMessages.reverse());
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentSessionId]); // Run effect when currentSessionId changes

  const handleSendMessage = async (content: string, file?: File) => {
    setIsTyping(true);

    // Add the user's message to the local state
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
      attachment: file ? { name: file.name, type: file.type } : undefined,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Call the handleSendMessage function from ChatContext
      const response = await sendMessage(content, file);

      // Add the bot's response to the local state
      if (response && response.data) {
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

      // Add an error message to the local state
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Failed to get AI response. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full relative">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#F7F7F7] dark:bg-[#BFA7F3]/80 rounded-tl-[64px] -z-10 transition-colors duration-1000" />

      <div className="w-full flex flex-col h-full">
        {/* Messages container with fixed height and scroll */}
        <div
          className={cn(
            "flex-1 transition-opacity duration-500 overflow-y-auto",
            messages.length === 0 && "opacity-0"
          )}
        >
          <ScrollArea className="h-[calc(100vh-13.5rem)]">
            <ChatMessages messages={messages} />
          </ScrollArea>
        </div>

        {/* Input container fixed at the bottom */}
        <div
          className={cn(
            "w-full flex flex-col items-center transition-all duration-500 ease-in-out",
            isTyping ? "bottom-8" : "bottom-0"
          )}
        >
          {/* WelcomeHeader and ChatInputContainer wrapped in a centered container */}
          <div className="w-full max-w-2xl px-4 flex flex-col items-center gap-2">
            {messages.length === 0 && (
              <WelcomeHeader
                userName={user?.userName || "Guest"}
                isVisible={!isTyping}
              />
            )}
            <ChatInputContainer
              onSendMessage={handleSendMessage}
              isExpanded={isTyping}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
