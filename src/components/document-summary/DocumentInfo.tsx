
import { FileText, Clock, Sparkles } from "lucide-react";

interface DocumentInfoProps {
  originalName: string;
  createdAt: string;
}

export const DocumentInfo = ({ originalName, createdAt }: DocumentInfoProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  return (
    <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6 w-full sm:w-auto">
      <div className="relative group flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-lg sm:rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-2 sm:p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-lg sm:rounded-xl shadow-xl">
          <div className="relative">
            <FileText className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
            <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-300 absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-1 sm:mb-2 break-words">
          {originalName}
        </h1>
        <div className="flex items-center text-gray-500 text-xs sm:text-sm">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
          <span className="font-medium truncate">Uploaded {formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};
