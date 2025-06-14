
import { Bot, Sparkles } from "lucide-react";

export const ChatHeader = () => {
  return (
    <div className="mb-3 sm:mb-4 md:mb-6">
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
        <div className="relative flex-shrink-0">
          <div className="p-1.5 sm:p-2 md:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg">
            <Bot className="h-4 w-4 sm:h-5 sm:w-5 md:h-7 md:w-7 text-white" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 p-0.5 sm:p-1 bg-yellow-400 rounded-full">
            <Sparkles className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 text-yellow-800" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent leading-tight">
            AI Legal Assistant
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg mt-0.5 sm:mt-1 leading-relaxed">
            Professional legal document analysis
          </p>
          <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
            <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-green-600 font-medium">Online & Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
