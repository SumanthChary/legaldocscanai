import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Key, 
  Clock, 
  Globe, 
  FileCheck, 
  Users, 
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface SecuritySettings {
  mfa_required: boolean;
  session_timeout: number;
  ip_allowlist: string[];
  audit_logging: boolean;
  data_retention_days: number;
  password_policy: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;
  };
}

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details: any;
  ip_address?: string;
  created_at: string;
  profiles: {
    username: string;
    email: string;
  };
}

interface LoginHistory {
  user_id: string;
  timestamp: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
}

export const SecurityManagement = () => {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    mfa_required: false,
    session_timeout: 480, // 8 hours in minutes
    ip_allowlist: [],
    audit_logging: true,
    data_retention_days: 90,
    password_policy: {
      min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_symbols: false,
    },
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newIp, setNewIp] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, security_settings')
        .eq('id', user.id)
        .single();

      if (!profile?.organization_id) {
        setLoading(false);
        return;
      }

      // Load security settings from profile or use defaults
      if (profile.security_settings && typeof profile.security_settings === 'object') {
        setSecuritySettings({ ...securitySettings, ...(profile.security_settings as Partial<SecuritySettings>) });
      }

      // Fetch recent audit logs
      const { data: logs, error: logsError } = await supabase
        .from('audit_logs')
        .select('id, user_id, action, resource_type, resource_id, details, ip_address, created_at')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (logsError) throw logsError;

      // Fetch user profiles for the logs
      const userIds = [...new Set(logs?.map(log => log.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, email')
        .in('id', userIds);

      // Combine logs with profile data
      const logsWithProfiles = (logs || []).map(log => ({
        ...log,
        profiles: profiles?.find(p => p.id === log.user_id) || { username: 'Unknown', email: 'unknown@example.com' },
        ip_address: (log.ip_address as string) || 'Unknown'
      }));

      setAuditLogs(logsWithProfiles);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading security data",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSecuritySettings = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ security_settings: securitySettings as any })
        .eq('id', user.id);

      if (error) throw error;

      // Log the action
      await supabase.rpc('log_user_action', {
        p_action: 'security_settings_updated',
        p_details:  securitySettings as any
      });

      toast({
        title: "Security settings updated",
        description: "Your security configuration has been saved successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating security settings",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const addIpToAllowlist = () => {
    if (!newIp.trim()) return;
    
    const updatedSettings = {
      ...securitySettings,
      ip_allowlist: [...securitySettings.ip_allowlist, newIp.trim()]
    };
    setSecuritySettings(updatedSettings);
    setNewIp("");
  };

  const removeIpFromAllowlist = (ip: string) => {
    const updatedSettings = {
      ...securitySettings,
      ip_allowlist: securitySettings.ip_allowlist.filter(allowedIp => allowedIp !== ip)
    };
    setSecuritySettings(updatedSettings);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
        return <Key className="h-4 w-4 text-green-500" />;
      case 'logout':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'document_uploaded':
      case 'document_analyzed':
        return <FileCheck className="h-4 w-4 text-blue-500" />;
      case 'team_member_invited':
      case 'team_member_removed':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'security_settings_updated':
        return <Shield className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge variant="outline" className="text-green-600 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Success
      </Badge>
    ) : (
      <Badge variant="outline" className="text-red-600 border-red-200">
        <XCircle className="h-3 w-3 mr-1" />
        Failed
      </Badge>
    );
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Security Management</h2>
        <p className="text-muted-foreground">Configure security policies and monitor access</p>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="settings" className="gap-2">
            <Shield className="h-4 w-4" />
            Security Settings
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <Activity className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="access" className="gap-2">
            <Globe className="h-4 w-4" />
            Access Control
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          {/* Authentication Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Authentication & Access
              </CardTitle>
              <CardDescription>Configure authentication requirements and session management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Multi-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all organization members
                  </p>
                </div>
                <Switch
                  checked={securitySettings.mfa_required}
                  onCheckedChange={(checked) =>
                    setSecuritySettings({ ...securitySettings, mfa_required: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Session Timeout (minutes)</label>
                <Input
                  type="number"
                  value={securitySettings.session_timeout}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      session_timeout: parseInt(e.target.value) || 480,
                    })
                  }
                  className="w-32"
                />
                <p className="text-xs text-muted-foreground">
                  Users will be logged out after this period of inactivity
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Audit Logging</h4>
                  <p className="text-sm text-muted-foreground">
                    Log all user actions and security events
                  </p>
                </div>
                <Switch
                  checked={securitySettings.audit_logging}
                  onCheckedChange={(checked) =>
                    setSecuritySettings({ ...securitySettings, audit_logging: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data Retention (days)</label>
                <Input
                  type="number"
                  value={securitySettings.data_retention_days}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      data_retention_days: parseInt(e.target.value) || 90,
                    })
                  }
                  className="w-32"
                />
                <p className="text-xs text-muted-foreground">
                  How long to keep audit logs and user data
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={updateSecuritySettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Security Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>Set password requirements for your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Password Length</label>
                <Input
                  type="number"
                  value={securitySettings.password_policy.min_length}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      password_policy: {
                        ...securitySettings.password_policy,
                        min_length: parseInt(e.target.value) || 8,
                      },
                    })
                  }
                  className="w-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Require uppercase letters</span>
                  <Switch
                    checked={securitySettings.password_policy.require_uppercase}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        password_policy: {
                          ...securitySettings.password_policy,
                          require_uppercase: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Require lowercase letters</span>
                  <Switch
                    checked={securitySettings.password_policy.require_lowercase}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        password_policy: {
                          ...securitySettings.password_policy,
                          require_lowercase: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Require numbers</span>
                  <Switch
                    checked={securitySettings.password_policy.require_numbers}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        password_policy: {
                          ...securitySettings.password_policy,
                          require_numbers: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Require symbols</span>
                  <Switch
                    checked={securitySettings.password_policy.require_symbols}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        password_policy: {
                          ...securitySettings.password_policy,
                          require_symbols: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Recent security events and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-medium mt-4">No audit logs found</h3>
                    <p className="text-muted-foreground">
                      User actions will appear here when audit logging is enabled
                    </p>
                  </div>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="mt-1">
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {log.profiles.username || log.profiles.email}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {log.action.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {log.resource_type && `${log.resource_type} • `}
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                        {log.ip_address && (
                          <p className="text-xs text-muted-foreground">
                            IP: {log.ip_address}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                IP Address Allowlist
              </CardTitle>
              <CardDescription>
                Restrict access to your organization from specific IP addresses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Adding IP restrictions will block access from all other IP addresses. 
                  Make sure to include your current IP address to avoid being locked out.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Input
                  placeholder="Enter IP address (e.g., 192.168.1.1)"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                />
                <Button onClick={addIpToAllowlist} disabled={!newIp.trim()}>
                  Add IP
                </Button>
              </div>

              <div className="space-y-2">
                {securitySettings.ip_allowlist.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No IP restrictions configured. Access is allowed from any IP address.
                  </p>
                ) : (
                  securitySettings.ip_allowlist.map((ip, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <code className="text-sm">{ip}</code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeIpFromAllowlist(ip)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};