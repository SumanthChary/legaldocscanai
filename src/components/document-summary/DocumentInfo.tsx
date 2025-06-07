
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
    <div className="flex items-start gap-4 mb-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl shadow-xl">
          <div className="relative">
            <FileText className="h-8 w-8 text-white" />
            <Sparkles className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
          {originalName}
        </h1>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="h-4 w-4 mr-2" />
          <span className="font-medium">Uploaded {formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};
