
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Settings, Save, Camera, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ProfileFormProps = {
  username: string;
  email: string;
  onUsernameChange: (value: string) => void;
  loading?: boolean;
  avatarUrl?: string;
  onAvatarChange?: (url: string) => void;
};

export const ProfileForm = ({ username, email, onUsernameChange, loading = false, avatarUrl, onAvatarChange }: ProfileFormProps) => {
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image under 5MB",
      });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select a JPG, PNG, or WebP image",
      });
      return;
    }

    setUploadingAvatar(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `avatars/${user.id}/avatar.${fileExt}`;
      
      // Delete old avatar if exists
      await supabase.storage
        .from('documents')
        .remove([`avatars/${user.id}/avatar.jpg`, `avatars/${user.id}/avatar.png`, `avatars/${user.id}/avatar.webp`]);
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      const avatarUrl = urlData.publicUrl;

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      onAvatarChange?.(avatarUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error uploading image",
        description: error.message,
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const updateProfile = async () => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user logged in");

      const updates = {
        id: user.id,
        username,
        email,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl p-4 sm:p-6 lg:p-8">
        <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-xl mr-3 sm:mr-4" />
          <Skeleton className="h-5 sm:h-6 lg:h-7 w-32 sm:w-40 lg:w-48" />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 sm:h-5 w-16 sm:w-20" />
            <Skeleton className="h-10 sm:h-12 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 sm:h-5 w-20 sm:w-24" />
            <Skeleton className="h-10 sm:h-12 w-full" />
            <Skeleton className="h-3 sm:h-4 w-48 sm:w-64" />
          </div>

          <div className="pt-4 sm:pt-6 border-t border-gray-200">
            <Skeleton className="h-10 sm:h-12 w-full" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
        <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
          <Settings className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Account Information</h2>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
              <AvatarImage src={avatarUrl} alt="Profile picture" />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg sm:text-xl font-semibold">
                {username ? username.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <Button
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              size="sm"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              {uploadingAvatar ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              ) : (
                <Camera className="h-3 w-3" />
              )}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-xs text-gray-500 text-center">
            Click the camera icon to update your profile picture
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="username" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700">
            <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-600" />
            Full Name
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white text-sm sm:text-base"
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700">
            <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-600" />
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="h-10 sm:h-12 border-gray-200 bg-gray-50 cursor-not-allowed text-sm sm:text-base"
          />
          <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center">
            <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
            Email cannot be changed. Contact support if you need to update it.
          </p>
        </div>

        <div className="pt-4 sm:pt-6 border-t border-gray-200">
          <Button 
            onClick={updateProfile} 
            disabled={saving}
            className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-300 text-sm sm:text-base"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                <span className="hidden sm:inline">Saving Changes...</span>
                <span className="sm:hidden">Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="hidden sm:inline">Update Profile</span>
                <span className="sm:hidden">Update</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 lg:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">Account Security</h3>
        <p className="text-xs sm:text-sm text-blue-800">
          Your account is protected with enterprise-grade security. For password changes or security concerns, please contact our support team.
        </p>
      </div>
    </Card>
  );
};
