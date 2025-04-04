
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo, DesktopMenu, MobileMenu, useAuthSession } from "./header";
import { Button } from "./ui/button";
import { Book } from "lucide-react";

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
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <BrandLogo />
          
          <div className="hidden md:flex items-center gap-2 mx-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1" 
              onClick={() => navigate("/documentation")}
            >
              <Book className="h-4 w-4" />
              <span>Docs</span>
            </Button>
          </div>
          
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
  );
}
