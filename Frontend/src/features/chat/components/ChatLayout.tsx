import { ChatList } from "./chat-list/ChatList";
import { ChatContent } from "./chat-messages/ChatContent";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
// import { mockSessions } from "../data/mock";
import { ChatSession } from "../types";
import { config } from "../../../../config";
import { useChat } from "@/contexts/ChatContext";

export function ChatLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setSessions, error, currentSessionId, setError } = useChat();
  useEffect(() => {
    const fetchChats = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        setError("User ID or token not found in local storage.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${config.apiUrl}/v1/chats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch chats");
        }

        const responseData = await response.json();

        // Map the API response to ChatSession format
        const fetchedSessions: ChatSession[] = responseData.data.chats.map(
          (chat: any) => ({
            id: chat.id,
            title: chat.name,
            timestamp: new Date(chat.createdAt),
          })
        );

        // Update the sessions state
        setSessions(fetchedSessions);
        setError(null);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [currentSessionId]);

  return (
    <div className="flex flex-1 overflow-hidden pt-8">
      <div
        className={cn(
          "ml-8 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[100px]" : "w-[400px]"
        )}
      >
        <div
          className={cn(
            "h-full rounded-[1rem_1rem_0_0] transition-all duration-300 ease-in-out",
            !isCollapsed && "shadow-[0_3px_6px_rgba(0,0,0,0.1)]"
          )}
        >
          <ChatList
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </div>
      </div>
      <div className="flex-1">
        <ChatContent />
      </div>
    </div>
  );
}
