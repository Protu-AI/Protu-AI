import { useState } from 'react';
import { cn } from '@/lib/utils';
import { WelcomeHeader } from './welcome/WelcomeHeader';
import { ChatInputContainer } from './input/ChatInputContainer';

interface EmptyStateProps {
  userName?: string;
  onSendMessage: (content: string) => void;
}

export function EmptyState({ userName = 'Talaat', onSendMessage }: EmptyStateProps) {
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (content: string) => {
    setIsTyping(true);
    onSendMessage(content);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className={cn(
        "w-full transition-all duration-500 ease-in-out flex flex-col items-center",
        isTyping ? "pl-[155px] pr-[155px]" : "px-4"
      )}>
        <WelcomeHeader 
          userName={userName}
          isVisible={!isTyping}
        />
        <ChatInputContainer 
          onSendMessage={handleSendMessage}
          isExpanded={isTyping}
        />
      </div>
    </div>
  );
}
