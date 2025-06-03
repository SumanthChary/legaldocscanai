
import { Bot } from "lucide-react";

export const ChatHeader = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            AI Legal Assistant
          </h1>
          <p className="text-gray-600">Professional legal document analysis and consultation</p>
        </div>
      </div>
    </div>
  );
};
