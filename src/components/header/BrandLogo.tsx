
import { Link } from "react-router-dom";

export const BrandLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        <div className="relative">
          <img 
            src="/lovable-uploads/033ae172-090d-4798-8206-fd0753c225bb.png" 
            alt="LegalBriefAI" 
            className="h-6 w-6 sm:h-8 sm:w-8 object-contain rounded-lg"
          />
        </div>
      </div>
      <span className="text-lg sm:text-xl font-bold font-aeonik bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        LegalBriefAI
      </span>
    </Link>
  );
};
