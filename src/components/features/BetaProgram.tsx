
import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

export const BetaProgram = () => {
  const [showBetaForm, setShowBetaForm] = useState(false);
  const [email, setEmail] = useState("");
  const [betaFeatureInterest, setBetaFeatureInterest] = useState("");

  const handleBetaSignup = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please provide your email address to join the beta waitlist.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Beta signup:", { email, featureInterest: betaFeatureInterest });
    
    toast({
      title: "Beta Access Request Received",
      description: "Thank you for your interest! We'll be in touch with more details about our beta program.",
    });
    
    setShowBetaForm(false);
    setEmail("");
    setBetaFeatureInterest("");
  };
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl shadow-sm mb-16">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0 md:mr-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Sparkles className="h-6 w-6 text-blue-500 mr-2" />
            Exclusive Beta Program
          </h2>
          <p className="text-gray-700">
            Get early access to our most innovative features before they're publicly available.
            Join our beta program to help shape the future of legal document analysis.
          </p>
        </div>
        <Sheet open={showBetaForm} onOpenChange={setShowBetaForm}>
          <SheetTrigger asChild>
            <Button size="lg" className="shrink-0">
              Join Beta Waitlist
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Join Our Beta Program</SheetTitle>
              <SheetDescription>
                Get early access to our upcoming features and help shape the future of legal document analysis.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium block mb-2">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="feature-interest" className="text-sm font-medium block mb-2">
                  Which feature are you most interested in?
                </label>
                <select
                  id="feature-interest"
                  value={betaFeatureInterest}
                  onChange={(e) => setBetaFeatureInterest(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a feature</option>
                  <option value="AI Contract Analyzer">AI Contract Analyzer</option>
                  <option value="Legal Compliance Checker">Legal Compliance Checker</option>
                  <option value="Multilingual Support">Advanced Language Processing</option>
                  <option value="Visual Analytics">Visual Analytics Suite</option>
                  <option value="Collaboration Tools">Enhanced Collaboration Tools</option>
                </select>
              </div>
              <Button 
                onClick={handleBetaSignup} 
                className="w-full mt-4"
              >
                Submit
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
