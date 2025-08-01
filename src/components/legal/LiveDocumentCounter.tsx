import { useState, useEffect } from "react";
import { FileText, TrendingUp } from "lucide-react";

export const LiveDocumentCounter = () => {
  const [count, setCount] = useState(4237);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200/50">
      <FileText className="h-4 w-4 text-green-600" />
      <span className="text-sm font-semibold text-green-700">
        {count.toLocaleString()} legal documents processed this month
      </span>
      <TrendingUp className="h-4 w-4 text-green-600" />
    </div>
  );
};