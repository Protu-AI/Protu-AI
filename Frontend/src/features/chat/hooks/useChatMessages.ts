import { useState, useCallback } from 'react';
import { Message } from '../types';

export function useChatMessages(initialMessages: Message[]) {
  const [messages, setMessages] = useState(initialMessages);

  const handleSendMessage = useCallback((content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  return {
    messages,
    handleSendMessage,
  };
}
