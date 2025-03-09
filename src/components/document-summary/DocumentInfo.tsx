
import { FileText, Clock } from "lucide-react";

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
    <div className="flex items-start gap-4 mb-4">
      <div className="p-3 bg-primary/10 rounded-lg">
        <FileText className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{originalName}</h1>
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <Clock className="h-4 w-4 mr-1" />
          Uploaded {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
};
