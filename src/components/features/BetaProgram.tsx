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
  return;
};