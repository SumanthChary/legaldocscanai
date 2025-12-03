import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  Trash2,
  
  Globe,
  Lock,
  HelpCircle,
  FileText,
  Settings as SettingsIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

export default function MobileSettings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar_url: ""
  });
  const [notifications, setNotifications] = useState(true);
  

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    if (!user) return;
    
    try {
      setFormData(prev => ({
        ...prev,
        email: user.email || ""
      }));

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setFormData({
          username: data.username || "",
          email: data.email || user.email || "",
          avatar_url: data.avatar_url || ""
        });
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: formData.username,
          avatar_url: formData.avatar_url,
          email: formData.email,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success("Profile updated successfully");
      await getProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <MobileHeader title="Settings" showBack />
        <div className="px-4 py-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
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
      <MobileHeader title="Settings" showBack />
      
      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Profile Header */}
        <Card className="p-6 border-0 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={formData.avatar_url} />
                <AvatarFallback className="text-lg bg-primary/20 text-primary">
                  {(formData.username || formData.email)
                    ?.charAt(0)
                    ?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0 bg-background border-2 border-background"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">
                {formData.username || "User"}
              </h2>
              <p className="text-muted-foreground text-sm">{formData.email}</p>
              <Badge variant="secondary" className="mt-2">
                <Crown className="w-3 h-3 mr-1" />
                Free Plan
              </Badge>
            </div>
          </div>
        </Card>

        {/* Account Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Account Settings</h3>
          </div>

          <Card className="p-4 border-0 bg-card/50">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Display Name</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your display name"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="h-11 bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
              </div>
            </div>
            <Separator className="my-4" />
            <Button
              onClick={updateProfile}
              disabled={saving}
              className="w-full h-11"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Card>
        </div>

        {/* App Preferences */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Preferences</h3>
          </div>
          
          <Card className="border-0 bg-card/50">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">Get notified about scan results</div>
                  </div>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>
              
            </div>
          </Card>
        </div>

        {/* Subscription */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Subscription</h3>
          </div>
          
          <Card className="p-4 border-0 bg-gradient-to-br from-yellow-50/50 to-yellow-100/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Upgrade to Pro</h4>
                <p className="text-sm text-muted-foreground">Unlock unlimited scans and advanced features</p>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-sm">
                Upgrade
              </Button>
            </div>
          </Card>
        </div>

        {/* Support & Legal */}
        <div className="space-y-4">
          <Card className="border-0 bg-card/50">
            <div className="p-4 space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 hover:bg-muted/50"
              >
                <HelpCircle className="w-5 h-5 mr-3 text-muted-foreground" />
                Help & Support
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start h-12 hover:bg-muted/50"
              >
                <FileText className="w-5 h-5 mr-3 text-muted-foreground" />
                Privacy Policy
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start h-12 hover:bg-muted/50"
              >
                <Shield className="w-5 h-5 mr-3 text-muted-foreground" />
                Terms of Service
              </Button>
            </div>
          </Card>
        </div>

        {/* Data Management */}
        <Card className="border-0 bg-card/50">
          <div className="p-4 space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            >
              <Trash2 className="w-5 h-5 mr-3" />
              Clear App Data
            </Button>
          </div>
        </Card>

        {/* Sign Out */}
        <Card className="p-4 border-destructive/20 border-0 bg-gradient-to-br from-red-50/50 to-red-100/30">
          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full gap-2 h-12 bg-red-600 hover:bg-red-700"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </Card>

        {/* App Version */}
        <div className="text-center text-sm text-muted-foreground pb-6 space-y-1">
          <p>LegalDeep AI v2.0</p>
          <p>Professional legal document analysis</p>
        </div>
      </div>
    </MobileLayout>
  );
}