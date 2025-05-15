import { Message } from '../types';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex w-full gap-4 p-4',
        isBot ? 'bg-muted/50' : 'bg-background'
      )}
    >
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-sm text-muted-foreground">
          {isBot ? 'Assistant' : 'You'}
        </p>
        <div className="prose prose-neutral dark:prose-invert">
          {message.content}
        </div>
      </div>
    </div>
  );
}
