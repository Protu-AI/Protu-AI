import { FileText, SendHorizontal } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({ onSendMessage, disabled, className }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isHoveringDoc, setIsHoveringDoc] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("relative w-[772px]", className)}>
      <div 
        className="absolute left-[27px] top-1/2 -translate-y-1/2 z-10"
        onMouseEnter={() => setIsHoveringDoc(true)}
        onMouseLeave={() => setIsHoveringDoc(false)}
      >
        <FileText 
          className={cn(
            "h-6 w-6 transition-colors cursor-pointer",
            isHoveringDoc ? "text-[#5F24E0]" : "text-[#A6B5BB]"
          )}
        />
      </div>
      <div className="absolute right-[27px] top-1/2 -translate-y-1/2 z-10">
        <SendHorizontal 
          className={cn(
            "h-6 w-6 transition-colors",
            message.trim() ? "text-[#5F24E0] cursor-pointer" : "text-[#A6B5BB]"
          )}
          onClick={message.trim() ? handleSend : undefined}
        />
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={1}
        className="h-[72px] w-full resize-none rounded-[24px] border border-[#A6B5BB] bg-background px-[72px] py-[27px] font-['Archivo'] text-base font-normal text-[#A6B5BB] placeholder:text-[#A6B5BB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5F24E0] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
      />
    </div>
  );
}
