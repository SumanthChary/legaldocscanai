
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type WelcomeHeaderProps = {
  session: any;
};

export const WelcomeHeader = ({ session }: WelcomeHeaderProps) => {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProfile(session.user.id);
    }
  }, [session?.user?.id]);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setUserProfile(data);
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
        Welcome back, {userProfile?.full_name || session?.user?.email?.split('@')[0] || 'User'}
      </h1>
      <p className="text-sm md:text-base text-muted-foreground">
        Here's what's happening with your documents today.
      </p>
    </div>
  );
};
