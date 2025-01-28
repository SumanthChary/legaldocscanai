import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-accent" />
            <span className="text-xl font-semibold text-primary">LegalAI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-gray-600 hover:text-primary">
              Features
            </Button>
            <Button variant="ghost" onClick={() => navigate("/pricing")} className="text-gray-600 hover:text-primary">
              Pricing
            </Button>
            <Button variant="default" onClick={() => navigate("/dashboard")} className="bg-primary text-white">
              Get Started
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};