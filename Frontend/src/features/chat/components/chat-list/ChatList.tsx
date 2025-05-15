import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ChatListHeader } from "./ChatListHeader";
import { ChatSearch } from "./ChatSearch";
import { ChatListGroup } from "./ChatListGroup";
import { groupChatSessionsByDate } from "@/lib/utils/chat";
import { cn } from "@/lib/utils";
import { useChat } from "@/contexts/ChatContext";

interface ChatListProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ChatList({ isCollapsed, onToggleCollapse }: ChatListProps) {
  const [search, setSearch] = useState("");
  const { sessions, handleSelectSession, handleNewChat } = useChat();

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(search.toLowerCase())
  );

  const groupedSessions = groupChatSessionsByDate(filteredSessions);

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-[1rem_1rem_0_0] transition-all duration-1000",
        isCollapsed ? "bg-transparent" : "bg-[#F7F7F7] dark:bg-[#BFA7F3]/80"
      )}
    >
      <div className="flex-none p-6">
        <ChatListHeader
          isCollapsed={isCollapsed}
          onToggle={onToggleCollapse}
          onNewChat={handleNewChat}
        />
        <div
          className={cn(
            "mt-4 overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed
              ? "w-0 opacity-0 translate-x-[-100%]"
              : "w-full opacity-100 translate-x-0"
          )}
        >
          <ChatSearch value={search} onChange={setSearch} />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div
          className={cn(
            "px-6 space-y-6 transition-all duration-300 ease-in-out",
            isCollapsed
              ? "w-0 opacity-0 translate-x-[-100%]"
              : "w-full opacity-100 translate-x-0"
          )}
        >
          {Object.entries(groupedSessions)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([timestamp, sessions]) => (
              <ChatListGroup
                key={timestamp}
                date={new Date(Number(timestamp))}
                sessions={sessions}
              />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
