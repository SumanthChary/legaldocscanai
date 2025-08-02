
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Book } from "lucide-react";
import { UserProfile } from "./UserProfile";

type DesktopMenuProps = {
  session: any;
  profile: any | null;
  handleSignOut: () => Promise<void>;
};

export const DesktopMenu = ({ session, profile, handleSignOut }: DesktopMenuProps) => {
  const navigate = useNavigate();

  return (
    <nav className="hidden md:flex items-center space-x-2">
      <Button
        variant="ghost"
        onClick={() => navigate("/features")}
        className="text-neutral-600 hover:text-legal-navy transition-all duration-200"
      >
        Features
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate("/pricing")}
        className="text-neutral-600 hover:text-legal-navy transition-all duration-200"
      >
        Pricing
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate("/security")}
        className="text-neutral-600 hover:text-legal-navy transition-all duration-200"
      >
        Security
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate("/contact")}
        className="text-neutral-600 hover:text-legal-navy transition-all duration-200"
      >
        Contact
      </Button>
      {session ? (
        <>
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-neutral-600 hover:text-legal-navy transition-all duration-200"
          >
            Dashboard
          </Button>
          <UserProfile profile={profile} handleSignOut={handleSignOut} />
        </>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => navigate("/auth")}
          className="ml-4 border-legal-gold text-legal-gold hover:bg-legal-gold hover:text-legal-navy transition-all duration-300"
        >
          Start Free Trial
        </Button>
      )}
    </nav>
  );
};
