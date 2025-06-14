
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
    <div className="flex-1 overflow-hidden bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/60 mb-2 sm:mb-3 md:mb-4">
      <ChatMessageList smooth>
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            variant={message.sender === "user" ? "sent" : "received"}
            className="mb-3 sm:mb-4"
          >
            <ChatBubbleAvatar
              className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 shrink-0"
              src={
                message.sender === "user"
                  ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                  : "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=64&h=64&q=80&crop=faces&fit=crop"
              }
              fallback={message.sender === "user" ? "US" : "AI"}
            />
            <div className="flex flex-col min-w-0 max-w-[85%] sm:max-w-[80%]">
              <ChatBubbleMessage
                variant={message.sender === "user" ? "sent" : "received"}
                className="text-sm sm:text-base p-3 sm:p-4 rounded-xl sm:rounded-2xl"
              >
                <div className="whitespace-pre-wrap leading-relaxed break-words">
                  {message.content}
                </div>
                {message.fileName && (
                  <div className={`text-xs sm:text-sm mt-2 opacity-80 flex items-center gap-1 ${
                    message.sender === "user" ? "text-blue-100" : "text-gray-500"
                  }`}>
                    <span className="text-xs">📎</span>
                    <span className="truncate max-w-[150px] sm:max-w-[200px]">{message.fileName}</span>
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
          <ChatBubble variant="received" className="mb-3 sm:mb-4">
            <ChatBubbleAvatar
              className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 shrink-0"
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=64&h=64&q=80&crop=faces&fit=crop"
              fallback="AI"
            />
            <ChatBubbleMessage isLoading className="text-sm sm:text-base p-3 sm:p-4" />
          </ChatBubble>
        )}
      </ChatMessageList>
    </div>
  );
};
