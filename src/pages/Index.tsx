
import { PageLayout } from "@/components/layout";
import { Dashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [showNewFeatures, setShowNewFeatures] = useState(true);
  
  return (
    <PageLayout>
      {showNewFeatures && (
        <div className="bg-gradient-to-r from-blue-50 via-purple-50/50 to-blue-50 border-b border-gray-200/50 py-3">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mr-3">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                <span className="hidden sm:inline">New AI features in closed beta! </span>
                <span>Apply for early access now.</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="link" 
                size="sm" 
                className="text-primary p-0 flex items-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-md px-2 transition-all duration-200" 
                asChild
              >
                <Link to="/features">
                  Learn more 
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
              <button 
                onClick={() => setShowNewFeatures(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}
      <Dashboard />
    </PageLayout>
  );
};

export default Index;
