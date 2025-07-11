import { Link } from "react-router-dom";
export const BrandLogo = () => {
  return <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        <div className="relative">
          <img alt="LegalDeep AI" className="h-6 w-6 sm:h-8 sm:w-8 object-contain rounded-lg" src="https://sdmntprcentralus.oaiusercontent.com/files/00000000-d0cc-61f5-a9b5-7f2a127dac93/raw?se=2025-07-11T16%3A33%3A29Z&sp=r&sv=2024-08-04&sr=b&scid=ec6541fe-76f8-5fb5-9006-fa822c4e5f3c&skoid=5cab1ff4-c20d-41dc-babb-df0c2cc21dd4&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-11T07%3A18%3A10Z&ske=2025-07-12T07%3A18%3A10Z&sks=b&skv=2024-08-04&sig=woXsYB3kaNXbLaAdT1C3oJP8apwj/Or9hPmmi80BBr0%3D" />
        </div>
      </div>
      <span className="text-lg sm:text-xl font-normal font-editorial bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        LegalDeep AI
      </span>
    </Link>;
};