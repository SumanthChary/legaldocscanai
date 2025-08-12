import { Bot, Sparkles } from "lucide-react";
export const ChatHeader = () => {
  return <div className="mb-3 sm:mb-4 md:mb-6">
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
        <div className="relative flex-shrink-0">
          <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg">
            <Bot className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
          </div>
          
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-700 bg-clip-text text-transparent leading-tight">Law AI Assistant</h1>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg mt-0.5 sm:mt-1 leading-relaxed">Ask Law AI - Upload Files and Chat with Files Themselves</p>
        </div>
      </div>
    </div>;
};