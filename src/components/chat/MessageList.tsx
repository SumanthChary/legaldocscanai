
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
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto bg-white/70 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl border border-gray-200/50 p-4 md:p-6 lg:p-8 mb-4 space-y-6 md:space-y-8 scrollbar-hide">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {isLoading && <LoadingMessage />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
