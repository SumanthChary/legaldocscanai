
import { Bot } from "lucide-react";

export const LoadingMessage = () => {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start space-x-4 max-w-[85%] md:max-w-[80%]">
        <div className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-sm">
          <Bot className="h-6 w-6 text-gray-600" />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-gray-600 font-medium">AI is analyzing your request...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
