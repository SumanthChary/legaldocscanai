import { useEffect, useState } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useCameraPermission } from "@/hooks/useCameraPermission";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Camera, Crown, Download, HelpCircle, LogOut, Share2, Users } from "lucide-react";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { useNavigate } from "react-router-dom";

export default function MobileProfile() {
  const { user, signOut } = useAuth();
  const { analyses } = useAnalyses();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [formData, setFormData] = useState({ username: "", email: "", avatar_url: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const {
    status: cameraPermission,
    requestPermission: requestCameraPermission,
    isRequesting: cameraRequesting,
    resetPermissionState,
  } = useCameraPermission();

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, email: user.email || "" }));
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile(data);
        setFormData({
          username: data.username || "",
          email: data.email || user.email || "",
          avatar_url: data.avatar_url || "",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await supabase.from("profiles").upsert({
        id: user.id,
        username: formData.username,
        avatar_url: formData.avatar_url,
        email: formData.email,
        updated_at: new Date().toISOString(),
      });
      toast.success("Profile updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const cameraStatusLabel =
    cameraPermission === "granted" ? "Enabled" : cameraPermission === "denied" ? "Blocked" : "Not requested";

  const handleCameraPermission = async () => {
    const granted = await requestCameraPermission();
    if (granted) {
      toast.success("Camera enabled for scanning");
    } else {
      toast.error("Camera permission is blocked in your browser settings");
    }
  };

  const handleCameraReset = () => {
    resetPermissionState();
    toast("Camera prompt reset. You will be asked again next time you scan.");
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="mx-auto min-h-screen max-w-sm bg-slate-50">
          <MobileHeader title="Profile" />
          <div className="space-y-4 px-4 py-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="h-24 animate-pulse rounded-3xl border border-slate-100 bg-white" />
            ))}
          </div>
        </div>
      </MobileLayout>
    );
  }

  const stats = {
    scans: analyses.length,
    risks: Math.max(analyses.length * 3, 1),
    saved: `$${(analyses.length * 11.6).toFixed(1)}K`,
    accuracy: "89%",
  };

  return (
    <MobileLayout>
      <div className="mx-auto min-h-screen max-w-sm bg-slate-50">
        <MobileHeader title="Profile" />
        <main className="space-y-6 px-4 pb-32 pt-5">
          <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-slate-100">
                  <AvatarImage src={formData.avatar_url} />
                  <AvatarFallback className="bg-slate-900/5 text-xl text-slate-900">
                    {(formData.username || formData.email).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border border-slate-200 bg-white text-slate-900 shadow"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Workspace owner</p>
                <h2 className="instrument-serif-regular-italic text-2xl text-slate-900">
                  {formData.username || "LegalDeep member"}
                </h2>
                <p className="text-sm text-slate-500">{formData.email}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-900">
                  <Crown className="h-3 w-3" /> Unlimited plan
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {[{ label: "Scans", value: stats.scans, tone: "text-slate-900" }, { label: "Risks", value: stats.risks, tone: "text-amber-600" }, { label: "Savings", value: stats.saved, tone: "text-emerald-600" }, { label: "Accuracy", value: stats.accuracy, tone: "text-slate-900" }].map((stat) => (
              <Card key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                <p className={`mt-2 text-2xl font-semibold ${stat.tone}`}>{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label === "Scans" ? "this month" : stat.label === "Risks" ? "flagged" : stat.label === "Savings" ? "vs counsel" : "avg OCR"}</p>
              </Card>
            ))}
          </div>

          <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">LegalDeep Unlimited</p>
                <p className="text-xs text-slate-500">Next billing · Dec 15 · $19</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-slate-200 text-slate-900"
                onClick={() => navigate("/plans")}
              >
                Manage plan
              </Button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Usage</span>
                <span>127 / ∞ scans</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-slate-900" style={{ width: "72%" }} />
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Push notifications</p>
                <p className="text-xs text-slate-500">Get alerts when reports are ready</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                aria-label="Toggle push notifications"
                className="self-start h-8 w-16 rounded-full border border-slate-200 bg-slate-200 transition-colors data-[state=checked]:bg-emerald-500 sm:self-auto"
                thumbClassName="h-6 w-6 translate-x-1 rounded-full bg-white shadow-sm transition data-[state=checked]:translate-x-8"
              />
            </div>
            <div className="mt-5 rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Camera access</p>
                  <p className="text-xs text-slate-500">Required for in-app scanning</p>
                </div>
                <Badge variant="outline" className="rounded-full px-3 text-xs font-semibold text-slate-900">
                  {cameraStatusLabel}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={handleCameraPermission}
                  disabled={cameraRequesting}
                  className="rounded-full"
                >
                  {cameraPermission === "granted" ? "Recheck camera" : "Enable camera"}
                </Button>
                {cameraPermission !== "prompt" && (
                  <Button variant="ghost" size="sm" onClick={handleCameraReset} className="rounded-full text-slate-500">
                    Reset prompt
                  </Button>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                If permissions stay blocked, open your device settings and enable camera access for this browser.
              </p>
            </div>
          </Card>

          <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="space-y-4 text-sm text-slate-700">
              {[{ label: "Invite legal team", icon: Users, description: "Seat teammates with restricted viewer access." }, { label: "Download archive", icon: Download, description: "Bulk export every PDF, insight, and summary." }, { label: "Help & support", icon: HelpCircle, description: "Talk to our counsel desk 24/7." }].map((action) => (
                <div key={action.label} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-3">
                  <action.icon className="h-5 w-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{action.label}</p>
                    <p className="text-xs text-slate-500">{action.description}</p>
                  </div>
                  <Share2 className="ml-auto h-4 w-4 text-slate-300" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Display name
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(event) => setFormData((prev) => ({ ...prev, username: event.target.value }))}
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Email
                </Label>
                <Input id="email" value={formData.email} disabled className="h-12 rounded-2xl border-transparent bg-slate-100 text-slate-500" />
              </div>
              <Button onClick={updateProfile} disabled={saving} className="h-12 rounded-2xl bg-slate-900 text-white">
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </Card>

          <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Automatic exports</p>
                <p className="text-xs text-slate-500">Weekly PDF digest</p>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-900">
                Configure
              </Button>
            </div>
          </Card>

          <Card className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm">
            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl"
            >
              <LogOut className="h-4 w-4" /> Sign out securely
            </Button>
          </Card>

          <p className="pb-8 text-center text-xs text-slate-400">LegalDeep AI App · SOC2 | GDPR | FERPA</p>
        </main>
      </div>
    </MobileLayout>
  );
}