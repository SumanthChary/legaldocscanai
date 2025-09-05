
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Book, MessageCircle } from "lucide-react";
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
        className="text-gray-600 hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
      >
        Features
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate("/pricing")}
        className="text-gray-600 hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
      >
        Pricing
      </Button>
      <Button
        variant="ghost"
        onClick={() => navigate("/blog")}
        className="text-gray-600 hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 flex items-center gap-2"
      >
        <Book className="h-4 w-4" />
        Blog
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
          <Button
            variant="ghost"
            onClick={() => navigate("/chat")}
            className="text-gray-600 hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </Button>
          <UserProfile profile={profile} handleSignOut={handleSignOut} />
        </>
      ) : (
        <Button 
          variant="default" 
          onClick={() => navigate("/auth")}
          className="ml-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Sign In
        </Button>
      )}
    </nav>
  );
};
