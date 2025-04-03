
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
    <nav className="hidden md:flex items-center space-x-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/features")}
        className="text-gray-600 hover:text-primary"
      >
        Features
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate("/pricing")}
        className="text-gray-600 hover:text-primary"
      >
        Pricing
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate("/blog")}
        className="text-gray-600 hover:text-primary"
      >
        <Book className="mr-2 h-4 w-4" />
        Blog
      </Button>
      {session ? (
        <>
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-gray-600 hover:text-primary"
          >
            Dashboard
          </Button>
          <UserProfile profile={profile} handleSignOut={handleSignOut} />
        </>
      ) : (
        <Button variant="default" onClick={() => navigate("/auth")}>
          Sign In
        </Button>
      )}
    </nav>
  );
};
