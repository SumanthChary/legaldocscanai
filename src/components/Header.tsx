
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo, DesktopMenu, MobileMenu, useAuthSession } from "./header";
import { Button } from "./ui/button";

export function Header() {
  const navigate = useNavigate();
  const { session, profile } = useAuthSession();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {/* Discount Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"></div>
        <div className="relative flex items-center justify-center gap-2 text-sm md:text-base font-medium">
          <span className="animate-pulse">🔥</span>
          <span>Limited Time: <strong>40% OFF</strong> All Plans - Save Hundreds on Legal Document Analysis!</span>
          <span className="animate-pulse">🔥</span>
        </div>
      </div>
      
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <BrandLogo />
            
            <MobileMenu 
              session={session} 
              profile={profile} 
              isOpen={isOpen} 
              setIsOpen={setIsOpen} 
              handleSignOut={handleSignOut} 
            />
            
            <DesktopMenu 
              session={session} 
              profile={profile} 
              handleSignOut={handleSignOut} 
            />
          </div>
        </div>
      </header>
    </>
  );
}
