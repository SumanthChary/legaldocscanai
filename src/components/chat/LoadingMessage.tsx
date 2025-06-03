
import { Bot } from "lucide-react";

export const LoadingMessage = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-3 max-w-[80%]">
        <div className="p-2 rounded-xl bg-gray-100">
          <Bot className="h-5 w-5 text-gray-600" />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="text-gray-500 ml-2">AI is analyzing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
