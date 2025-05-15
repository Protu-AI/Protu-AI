import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react';

interface ChatListHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
}

export function ChatListHeader({ isCollapsed, onToggle, onNewChat }: ChatListHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={onToggle}
      >
        {isCollapsed ? (
          <PanelLeftOpen className="h-10 w-10" />
        ) : (
          <PanelLeftClose className="h-10 w-10" />
        )}
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <Button
        size="icon"
        className="shrink-0 bg-[#5F24E0] p-1.5 hover:bg-[#5F24E0]/90"
        onClick={onNewChat}
      >
        <Plus className="h-6 w-6 text-[#F7F7F7] stroke-[2.5]" />
        <span className="sr-only">New chat</span>
      </Button>
    </div>
  );
}
