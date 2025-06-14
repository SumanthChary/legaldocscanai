
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Trash2 } from "lucide-react";
import { ProfileForm } from "./ProfileForm";
import { TrashSection } from "./TrashSection";

type ProfileTabsProps = {
  username: string;
  email: string;
  onUsernameChange: (value: string) => void;
  loading?: boolean;
};

export const ProfileTabs = ({ username, email, onUsernameChange, loading = false }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
      <TabsList className="w-full justify-start grid grid-cols-2 sm:flex">
        <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="trash" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Trash</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileForm 
          username={username}
          email={email}
          onUsernameChange={onUsernameChange}
          loading={loading}
        />
      </TabsContent>

      <TabsContent value="trash">
        <TrashSection />
      </TabsContent>
    </Tabs>
  );
};
