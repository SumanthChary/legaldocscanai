
import { PageLayout } from "@/components/layout";
import { Dashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [showNewFeatures, setShowNewFeatures] = useState(true);
  
  return (
    <PageLayout>
      {showNewFeatures && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 py-3">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-sm font-medium">New AI features coming soon!</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="link" size="sm" className="text-primary p-0" asChild>
                <Link to="/upcoming-features">Learn more</Link>
              </Button>
              <button 
                onClick={() => setShowNewFeatures(false)}
                className="text-gray-500 hover:text-gray-700"
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
