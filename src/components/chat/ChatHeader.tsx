
import { Bot, Sparkles } from "lucide-react";

export const ChatHeader = () => {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center space-x-3 md:space-x-4">
        <div className="relative">
          <div className="p-3 md:p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl md:rounded-2xl shadow-xl">
            <Bot className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 p-1 bg-yellow-400 rounded-full">
            <Sparkles className="h-2.5 w-2.5 md:h-3 md:w-3 text-yellow-800" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent leading-tight">
            AI Legal Assistant
          </h1>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl mt-1 leading-relaxed">
            Professional legal document analysis and consultation
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Online & Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
