import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layout";
import { UserPlus, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface InvitationData {
  id: string;
  email: string;
  role: string;
  organization_id: string;
  expires_at: string;
  status: string;
  organizations: {
    name: string;
    description?: string;
  };
}

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link");
      setLoading(false);
      return;
    }

    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const { data: invitation, error } = await supabase
        .from('team_invitations')
        .select('id, email, role, organization_id, expires_at, status')
        .eq('token', token)
        .eq('status', 'pending')
        .single();

      if (error) throw error;

      // Check if invitation is expired
      if (new Date(invitation.expires_at) < new Date()) {
        setError("This invitation has expired");
        setLoading(false);
        return;
      }

      // Fetch organization details separately
      const { data: org } = await supabase
        .from('organizations')
        .select('name, description')
        .eq('id', invitation.organization_id)
        .single();

      const invitationData: InvitationData = {
        ...invitation,
        organizations: {
          name: org?.name || 'Unknown Organization',
          description: org?.description,
        }
      };

      setInvitation(invitationData);
    } catch (error: any) {
      console.error('Error fetching invitation:', error);
      setError("Invalid or expired invitation");
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async () => {
    if (!invitation) return;

    setAccepting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to accept this invitation",
        });
        navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }

      // Check if user email matches invitation
      if (user.email !== invitation.email) {
        setError(`This invitation is for ${invitation.email}. Please sign in with the correct account.`);
        setAccepting(false);
        return;
      }

      // Update user profile with organization
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          organization_id: invitation.organization_id,
          role: invitation.role,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Add user to team members
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          organization_id: invitation.organization_id,
          user_id: user.id,
          role: invitation.role,
          status: 'active',
        });

      if (memberError) throw memberError;

      // Mark invitation as accepted
      const { error: inviteError } = await supabase
        .from('team_invitations')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
        })
        .eq('id', invitation.id);

      if (inviteError) throw inviteError;

      // Log the action
      await supabase.rpc('log_user_action', {
        p_action: 'team_invitation_accepted',
        p_details: { organization_id: invitation.organization_id, role: invitation.role }
      });

      toast({
        title: "Welcome to the team!",
        description: `You've successfully joined ${invitation.organizations.name}`,
      });

      // Redirect to dashboard
      navigate('/dashboard?tab=team');
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast({
        variant: "destructive",
        title: "Error accepting invitation",
        description: error.message,
      });
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading invitation...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <XCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <CardTitle>Invalid Invitation</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (!invitation) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <XCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <CardTitle>Invitation Not Found</CardTitle>
              <CardDescription>This invitation link is invalid or has already been used.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <UserPlus className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>Team Invitation</CardTitle>
            <CardDescription>
              You've been invited to join a team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">{invitation.organizations.name}</h3>
              {invitation.organizations.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {invitation.organizations.description}
                </p>
              )}
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Role:</strong> {invitation.role}
                </p>
                <p className="text-sm mt-1">
                  <strong>Email:</strong> {invitation.email}
                </p>
                <p className="text-sm mt-1">
                  <strong>Expires:</strong> {new Date(invitation.expires_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Button 
              onClick={acceptInvitation}
              disabled={accepting}
              className="w-full"
            >
              {accepting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Invitation
                </>
              )}
            </Button>

            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-sm"
              >
                Decline invitation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}