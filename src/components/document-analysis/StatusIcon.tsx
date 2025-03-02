
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

type StatusIconProps = {
  status: string;
};

export const StatusIcon = ({ status }: StatusIconProps) => {
  switch (status) {
    case 'pending':
      return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'failed':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  }
};
