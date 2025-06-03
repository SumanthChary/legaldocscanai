
import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { LoadingMessage } from "./LoadingMessage";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
};

type MessageListProps = {
  messages: Message[];
  isLoading: boolean;
};

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-6 mb-6 space-y-6 scrollbar-hide">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {isLoading && <LoadingMessage />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
