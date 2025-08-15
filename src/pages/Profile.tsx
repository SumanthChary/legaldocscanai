
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PageLayout } from "@/components/layout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setUsername(data.username);
          setEmail(data.email);
          setAvatarUrl(data.avatar_url || "");
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-4 sm:py-6 lg:py-12">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <ProfileHeader loading={loading} />
            <ProfileTabs
              username={username}
              email={email}
              onUsernameChange={setUsername}
              loading={loading}
              avatarUrl={avatarUrl}
              onAvatarChange={setAvatarUrl}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
