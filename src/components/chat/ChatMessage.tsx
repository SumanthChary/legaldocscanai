
import { Bot, User, Paperclip } from "lucide-react";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
};

type ChatMessageProps = {
  message: Message;
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4 md:mb-6`}
    >
      <div className={`flex items-start space-x-3 md:space-x-4 max-w-[90%] md:max-w-[85%] lg:max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
        <div className={`p-2.5 md:p-3 rounded-xl shadow-sm flex-shrink-0 ${
          message.sender === "user" 
            ? "bg-gradient-to-r from-blue-600 to-purple-600" 
            : "bg-gradient-to-r from-gray-100 to-gray-200"
        }`}>
          {message.sender === "user" ? (
            <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
          ) : (
            <Bot className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
          )}
        </div>
        <div
          className={`rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 shadow-lg backdrop-blur-sm border flex-1 min-w-0 ${
            message.sender === "user"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-300"
              : "bg-white text-gray-800 border-gray-200"
          }`}
        >
          <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base break-words">
            {message.content}
          </div>
          {message.fileName && (
            <div className={`text-xs md:text-sm mt-3 flex items-center ${
              message.sender === "user" ? "text-blue-100" : "text-gray-500"
            }`}>
              <Paperclip className="h-3 w-3 md:h-4 md:w-4 mr-2 flex-shrink-0" />
              <span className="font-medium truncate">{message.fileName}</span>
            </div>
          )}
          <div className={`text-xs mt-3 ${
            message.sender === "user" ? "text-blue-100" : "text-gray-400"
          }`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
