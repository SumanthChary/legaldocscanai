import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { WhopService } from '@/integrations/whop';

interface UserProfile {
  source?: string;
  whop_plan_id?: string;
  whop_user_id?: string;
}

export const WhopUserBadge = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('source, whop_plan_id, whop_user_id')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading || !profile || profile.source !== 'whop') {
    return null;
  }

  const getPlanBadgeInfo = (planId?: string) => {
    switch (planId) {
      case 'entrepreneur_shield':
        return { label: 'Entrepreneur Shield', color: 'bg-amber-100 text-amber-700 border-amber-200' };
      case 'business_guardian':
        return { label: 'Business Guardian', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'legal_command_center':
        return { label: 'Legal Command Center', color: 'bg-purple-100 text-purple-700 border-purple-200' };
      case 'lifetime_power_pack':
        return { label: 'Lifetime Power Pack', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      default:
        return { label: 'Whop Member', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    }
  };

  const badgeInfo = getPlanBadgeInfo(profile.whop_plan_id);

  return (
    <Badge className={`${badgeInfo.color} font-medium`}>
      {badgeInfo.label}
    </Badge>
  );
};