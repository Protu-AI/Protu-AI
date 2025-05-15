import { cn } from '@/lib/utils';
import { ChatInput } from './ChatInput';

interface ChatInputContainerProps {
  onSendMessage: (content: string) => void;
  isExpanded: boolean;
  className?: string; // Add className prop
}

export function ChatInputContainer({ onSendMessage, isExpanded, className }: ChatInputContainerProps) {
  return (
    <div className={cn(
      "transition-all duration-500 ease-in-out",
      isExpanded ? "w-[calc(100%-310px)]" : "w-[772px]",
      className // Apply the className prop
    )}>
      <ChatInput
        onSendMessage={onSendMessage}
      />
    </div>
  );
}
