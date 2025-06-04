
import { useEffect, useRef } from "react";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { LoadingMessage } from "./LoadingMessage";
import { Bot, User } from "lucide-react";

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
  return (
    <div className="flex-1 overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 mb-4">
      <ChatMessageList smooth>
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            variant={message.sender === "user" ? "sent" : "received"}
          >
            <ChatBubbleAvatar
              className="h-10 w-10 shrink-0"
              src={
                message.sender === "user"
                  ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                  : "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=64&h=64&q=80&crop=faces&fit=crop"
              }
              fallback={message.sender === "user" ? "US" : "AI"}
            />
            <div className="flex flex-col min-w-0 max-w-[80%]">
              <ChatBubbleMessage
                variant={message.sender === "user" ? "sent" : "received"}
              >
                <div className="whitespace-pre-wrap leading-relaxed break-words">
                  {message.content}
                </div>
                {message.fileName && (
                  <div className={`text-xs mt-2 opacity-80 ${
                    message.sender === "user" ? "text-blue-100" : "text-gray-500"
                  }`}>
                    📎 {message.fileName}
                  </div>
                )}
                <div className={`text-xs mt-2 opacity-70 ${
                  message.sender === "user" ? "text-blue-100" : "text-gray-400"
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </ChatBubbleMessage>
            </div>
          </ChatBubble>
        ))}
        
        {isLoading && (
          <ChatBubble variant="received">
            <ChatBubbleAvatar
              className="h-10 w-10 shrink-0"
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=64&h=64&q=80&crop=faces&fit=crop"
              fallback="AI"
            />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        )}
      </ChatMessageList>
    </div>
  );
};
