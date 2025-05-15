import { Button } from '@/components/ui/button';
import { ChatSession } from '../types';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatListGroupProps {
  date: Date;
  sessions: ChatSession[];
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
}

export function ChatListGroup({
  date,
  sessions,
  currentSessionId,
  onSelectSession,
}: ChatListGroupProps) {
  return (
    <div className="space-y-6">
      <h3 className="font-['Archivo'] text-base font-semibold text-[#565656] mb-6">
        {format(date, 'MMMM d, yyyy')}
      </h3>
      <div className="space-y-1">
        {sessions.map((session) => (
          <ChatListItem
            key={session.id}
            session={session}
            isActive={session.id === currentSessionId}
            onSelect={onSelectSession}
          />
        ))}
      </div>
    </div>
  );
}

interface ChatListItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: (id: string) => void;
}

function ChatListItem({ session, isActive, onSelect }: ChatListItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'group relative w-full justify-start rounded-[7px] px-3 py-2.5 font-["Archivo"] text-xl font-normal text-[#808080] bg-transparent hover:bg-[#EBEBEB]',
        isActive && 'bg-[#EBEBEB]'
      )}
      onClick={() => onSelect(session.id)}
    >
      <span className="truncate pr-8">{session.title}</span>
      <MoreHorizontal className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100" />
    </Button>
  );
}
