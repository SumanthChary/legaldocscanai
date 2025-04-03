
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const BrandLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <FileText className="h-6 w-6 text-accent" />
      <span className="text-xl font-semibold text-primary">LegalBriefAI</span>
    </Link>
  );
};
