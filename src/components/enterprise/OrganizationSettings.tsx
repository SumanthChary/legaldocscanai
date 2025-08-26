import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, FileText, Settings, BarChart3, Shield } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  subscription_tier: string;
  max_members: number;
  settings: any;
  created_at: string;
  updated_at: string;
}

interface UsageStats {
  total_members: number;
  total_documents: number;
  monthly_analyses: number;
  storage_used: number;
}

export const OrganizationSettings = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) {
        setLoading(false);
        return;
      }

      // Fetch organization details
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.organization_id)
        .single();

      if (orgError) throw orgError;

      // Fetch usage statistics
      const [membersResult, documentsResult] = await Promise.all([
        supabase
          .from('team_members')
          .select('id', { count: 'exact' })
          .eq('organization_id', profile.organization_id)
          .eq('status', 'active'),
        supabase
          .from('document_analyses')
          .select('id', { count: 'exact' })
          .eq('organization_id', profile.organization_id)
      ]);

      const stats: UsageStats = {
        total_members: membersResult.count || 0,
        total_documents: documentsResult.count || 0,
        monthly_analyses: 0, // Would need to calculate based on current month
        storage_used: 0, // Would need to calculate from storage
      };

      setOrganization(org);
      setUsageStats(stats);
      setOrgName(org.name);
      setOrgDescription(org.description || "");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading organization data",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrganization = async () => {
    if (!organization) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          name: orgName,
          description: orgDescription,
        })
        .eq('id', organization.id);

      if (error) throw error;

      // Log the action
      await supabase.rpc('log_user_action', {
        p_action: 'organization_updated',
        p_details: { name: orgName, description: orgDescription }
      });

      toast({
        title: "Organization updated",
        description: "Your organization settings have been saved successfully",
      });

      fetchOrganizationData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating organization",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const createOrganization = async () => {
    if (!orgName.trim()) return;

    setSaving(true);
    try {
      const { data, error } = await supabase.rpc('create_organization_with_owner', {
        org_name: orgName,
        org_description: orgDescription || null,
      });

      if (error) throw error;

      toast({
        title: "Organization created",
        description: "Your organization has been created successfully",
      });

      fetchOrganizationData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating organization",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case 'enterprise':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'professional':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-muted rounded animate-pulse" />
          <div className="h-48 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold mt-4">Create Your Organization</h2>
          <p className="text-muted-foreground">Get started by setting up your organization</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>Basic information about your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Organization Name</label>
              <Input
                placeholder="Enter organization name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                placeholder="Describe your organization"
                value={orgDescription}
                onChange={(e) => setOrgDescription(e.target.value)}
              />
            </div>
            <Button 
              onClick={createOrganization} 
              disabled={!orgName.trim() || saving}
              className="w-full"
            >
              {saving ? "Creating..." : "Create Organization"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Organization Settings</h2>
        <p className="text-muted-foreground">Manage your organization's settings and usage</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="usage" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Usage & Billing
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>Update your organization's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Organization Name</label>
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                  placeholder="Describe your organization"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={updateOrganization} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          {/* Subscription Info */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your current subscription and limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={`${getSubscriptionColor(organization.subscription_tier)} text-white`}>
                    {organization.subscription_tier.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created {new Date(organization.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline">Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{usageStats?.total_members}</p>
                    <p className="text-sm text-muted-foreground">Team Members</p>
                    <Progress 
                      value={(usageStats?.total_members || 0) / organization.max_members * 100} 
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {usageStats?.total_members} / {organization.max_members} limit
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{usageStats?.total_documents}</p>
                    <p className="text-sm text-muted-foreground">Documents</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{usageStats?.monthly_analyses}</p>
                    <p className="text-sm text-muted-foreground">Monthly Analyses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{usageStats?.storage_used}MB</p>
                    <p className="text-sm text-muted-foreground">Storage Used</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security policies for your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">Security Settings</h3>
                <p className="text-muted-foreground">
                  Advanced security features will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};