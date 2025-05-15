export interface Message {
  id: string; // A string representing the unique identifier for the message
  content: string; // The content of the message (e.g., text)
  role: "user" | "assistant" | "system";
  timestamp: Date;
  attachment?: {
    // Optional attachment field
    name: string; // The name of the attached file
    type: string; // The MIME type of the attached file
  };
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  sessions: ChatSession[];
  currentSessionId?: string;
}
