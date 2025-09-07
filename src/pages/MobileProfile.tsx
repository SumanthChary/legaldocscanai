import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  CreditCard, 
  LogOut, 
  Camera,
  Crown,
  BarChart3,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MobileProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    avatar_url: ""
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setProfile(prev => ({
          ...prev,
          email: user.email || ""
        }));

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile(prev => ({
            ...prev,
            username: data.username || "",
            avatar_url: data.avatar_url || ""
          }));
        }
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: profile.username,
          avatar_url: profile.avatar_url,
          email: profile.email,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <MobileLayout>
        <MobileHeader title="Profile" />
        <div className="px-4 py-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <MobileHeader title="Profile" />
      
      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-lg">
                  {(profile.username || profile.email)
                    ?.charAt(0)
                    ?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {profile.username || "User"}
              </h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <Badge variant="secondary" className="mt-2">
                <Crown className="w-3 h-3 mr-1" />
                Free Plan
              </Badge>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <BarChart3 className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-lg font-bold">24</div>
            <div className="text-xs text-muted-foreground">Scans</div>
          </Card>
          <Card className="p-4 text-center">
            <Crown className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <div className="text-lg font-bold">Pro</div>
            <div className="text-xs text-muted-foreground">Upgrade</div>
          </Card>
          <Card className="p-4 text-center">
            <Shield className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="text-lg font-bold">100%</div>
            <div className="text-xs text-muted-foreground">Secure</div>
          </Card>
        </div>

        {/* Profile Settings */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Choose a username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
          <Button
            onClick={updateProfile}
            disabled={saving}
            className="w-full mt-4"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Card>

        {/* App Settings */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Settings
          </h3>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Notifications</div>
                  <div className="text-sm text-muted-foreground">Push notifications</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Configure
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Subscription</div>
                  <div className="text-sm text-muted-foreground">Manage billing</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Upgrade
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Data</div>
                  <div className="text-sm text-muted-foreground">Clear cache & data</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Clear
              </Button>
            </div>
          </Card>
        </div>

        {/* Sign Out */}
        <Card className="p-4 border-destructive/20">
          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground pb-6">
          <p>LegalDeep Scanner v1.0</p>
          <p>Made with ❤️ for legal professionals</p>
        </div>
      </div>
    </MobileLayout>
  );
}