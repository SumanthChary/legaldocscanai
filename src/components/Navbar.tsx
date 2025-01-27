import { FileText, BarChart3, Search, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-accent" />
            <span className="text-xl font-semibold text-primary">LegalAI</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Button>
          </div>
          <Button variant="default" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};