
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type UserProfileProps = {
  profile: any | null;
  handleSignOut: () => Promise<void>;
};

export const UserProfile = ({ profile, handleSignOut }: UserProfileProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
          <Avatar className="h-8 w-8 ring-2 ring-gradient-to-r ring-from-blue-200 ring-to-purple-200">
            <AvatarImage src={profile?.avatar_url} alt={profile?.username || "User"} />
            <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100">
              {profile?.username ? profile.username.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{profile?.username || "Profile"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl">
        <DropdownMenuItem 
          onClick={() => navigate("/profile")}
          className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-red-600 transition-all duration-200"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
