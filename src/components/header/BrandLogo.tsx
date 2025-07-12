import { Link } from "react-router-dom";
export const BrandLogo = () => {
  return <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        <div className="relative">
          <img alt="LegalDeep AI" className="h-6 w-6 sm:h-8 sm:w-8 object-contain rounded-lg" src="/lovable-uploads/3a0fa624-9b7a-4749-806e-64143f7b5c69.png" />
        </div>
      </div>
      <span className="text-lg sm:text-xl font-normal font-editorial bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        LegalDeep AI
      </span>
    </Link>;
};