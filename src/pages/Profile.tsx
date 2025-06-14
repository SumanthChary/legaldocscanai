
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { PageLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Settings, Save, Trash2 } from "lucide-react";
import { TrashSection } from "@/components/profile/TrashSection";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-4 sm:py-6 lg:py-12">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 mx-auto mb-2" />
                <Skeleton className="h-4 sm:h-5 w-60 sm:w-80 mx-auto" />
              </div>

              <div className="space-y-4 sm:space-y-6">
                <Skeleton className="h-10 sm:h-12 w-full" />
                
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
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-4 sm:py-6 lg:py-12">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1 sm:mb-2">
                Profile Settings
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your account information and deleted documents</p>
            </div>

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
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Account Information</h2>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="username" className="flex items-center text-xs sm:text-sm font-semibold text-gray-700">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-600" />
                        Full Name
                      </label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        onChange={(e) => setEmail(e.target.value)}
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
              </TabsContent>

              <TabsContent value="trash">
                <TrashSection />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
