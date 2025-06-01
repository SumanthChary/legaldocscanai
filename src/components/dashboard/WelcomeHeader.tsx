
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";

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

  const userName = userProfile?.full_name || session?.user?.email?.split('@')[0] || 'User';

  return (
    <div className="relative">
      {/* Sophisticated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-blue-50/50 rounded-2xl blur-xl"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome back, {userName}
          </h1>
        </div>
        <p className="text-sm md:text-base text-gray-600 ml-11">
          Here's what's happening with your documents today.
        </p>
      </div>
    </div>
  );
};
