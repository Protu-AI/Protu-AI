import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatSession } from '../types';
import { ChatListHeader } from './chat-list/ChatListHeader';
import { ChatSearch } from './chat-list/ChatSearch';
import { ChatListGroup } from './chat-list/ChatListGroup';
import { groupBy } from 'lodash';
import { startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ChatListProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ChatList({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  isCollapsed,
  onToggleCollapse,
}: ChatListProps) {
  const [search, setSearch] = useState('');

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(search.toLowerCase())
  );

  const groupedSessions = groupBy(filteredSessions, (session) =>
    startOfDay(session.timestamp).getTime()
  );

  return (
    <div className="flex h-full flex-col bg-[#F7F7F7] rounded-[1rem_1rem_0_0]">
      <div className="flex-none p-6">
        <ChatListHeader
          isCollapsed={isCollapsed}
          onToggle={onToggleCollapse}
          onNewChat={onNewChat}
        />
        <div
          className={cn(
            "mt-4 overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
          )}
        >
          <ChatSearch value={search} onChange={setSearch} />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div
          className={cn(
            "px-6 space-y-6 overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
          )}
        >
          {Object.entries(groupedSessions)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([timestamp, sessions]) => (
              <ChatListGroup
                key={timestamp}
                date={new Date(Number(timestamp))}
                sessions={sessions}
                currentSessionId={currentSessionId}
                onSelectSession={onSelectSession}
              />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
