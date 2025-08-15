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
    console.log("Beta signup:", {
      email,
      featureInterest: betaFeatureInterest
    });
    toast({
      title: "Beta Access Request Received",
      description: "Thank you for your interest! We'll be in touch with more details about our beta program."
    });
    setShowBetaForm(false);
    setEmail("");
    setBetaFeatureInterest("");
  };
  return (
    <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mt-12">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">
          Join Our Beta Program
        </h2>
      </div>
      <p className="mb-6 text-gray-600 max-w-2xl mx-auto">
        Get early access to cutting-edge features and help shape the future of legal document analysis.
      </p>
      
      <Sheet open={showBetaForm} onOpenChange={setShowBetaForm}>
        <SheetTrigger asChild>
          <Button size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Request Beta Access
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Beta Program Application</SheetTitle>
            <SheetDescription>
              Tell us about your interest in our beta features
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Which features interest you most?
              </label>
              <textarea
                value={betaFeatureInterest}
                onChange={(e) => setBetaFeatureInterest(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Tell us about your specific use case and feature interests..."
              />
            </div>
            <Button onClick={handleBetaSignup} className="w-full">
              Submit Beta Request
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};