
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Book, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span>{profile?.username || "Profile"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Button variant="default" onClick={() => navigate("/auth")}>
          Sign In
        </Button>
      )}
    </nav>
  );
};
