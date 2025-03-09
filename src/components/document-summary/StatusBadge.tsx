
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  switch (status) {
    case 'completed':
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ${className}`}>
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </span>
      );
    case 'pending':
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ${className}`}>
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Processing
        </span>
      );
    case 'failed':
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ${className}`}>
          <AlertTriangle className="h-3 w-3 mr-1" />
          Failed
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ${className}`}>
          {status}
        </span>
      );
  }
};
