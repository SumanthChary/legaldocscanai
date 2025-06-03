
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
      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
        <div className={`p-2 rounded-xl ${
          message.sender === "user" 
            ? "bg-gradient-to-r from-blue-600 to-purple-600" 
            : "bg-gray-100"
        }`}>
          {message.sender === "user" ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-gray-600" />
          )}
        </div>
        <div
          className={`rounded-2xl p-4 shadow-sm ${
            message.sender === "user"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          {message.fileName && (
            <div className="text-xs mt-2 flex items-center opacity-80">
              <Paperclip className="h-3 w-3 mr-1" />
              {message.fileName}
            </div>
          )}
          <div className={`text-xs mt-2 opacity-70 ${
            message.sender === "user" ? "text-blue-100" : "text-gray-500"
          }`}>
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};
