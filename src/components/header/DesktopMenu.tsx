
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
    <nav className="hidden md:flex items-center space-x-4">
      <Button
        variant="ghost"
        onClick={() => navigate("/features")}
        className="text-navy-600 hover:text-navy-900 transition-colors font-medium text-sm"
      >
        Features
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate("/pricing")}
        className="text-navy-600 hover:text-navy-900 transition-colors font-medium text-sm"
      >
        Pricing
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate("/security")}
        className="text-navy-600 hover:text-navy-900 transition-colors font-medium text-sm"
      >
        Security
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate("/contact")}
        className="text-navy-600 hover:text-navy-900 transition-colors font-medium text-sm"
      >
        Contact
      </Button>
      {session ? (
        <>
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-gray-600 hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
          >
            Dashboard
          </Button>
          <UserProfile profile={profile} handleSignOut={handleSignOut} />
        </>
      ) : (
        <Button 
          onClick={() => navigate("/auth")}
          className="ml-4 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-6"
        >
          Start Free Trial
        </Button>
      )}
    </nav>
  );
};
