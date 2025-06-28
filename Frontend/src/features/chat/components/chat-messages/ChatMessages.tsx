import { Message } from "../../types";
import { ChatMessage } from "./ChatMessage";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-6">
      {" "}
      {/* Removed pb-[50px] and px-[155px] */}
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
