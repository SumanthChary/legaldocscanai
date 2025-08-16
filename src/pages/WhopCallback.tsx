import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WhopService } from '@/integrations/whop';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function WhopCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const handleWhopAuth = async () => {
      try {
        // Get Whop parameters from URL
        const whopUserId = searchParams.get('user_id') || searchParams.get('whop_user_id');
        const accessPass = searchParams.get('access_pass');
        const planId = searchParams.get('plan_id');
        const email = searchParams.get('email');
        const username = searchParams.get('username');

        if (!whopUserId) {
          throw new Error('Missing Whop user ID');
        }

        // Call our whop-auth edge function
        const { data, error } = await supabase.functions.invoke('whop-auth', {
          body: {
            whop_user_id: whopUserId,
            whop_access_pass: accessPass,
            whop_plan_id: planId,
            email,
            username
          }
        });

        if (error) {
          throw error;
        }

        if (data.success) {
          // If user exists, sign them in automatically
          if (data.exists && data.email) {
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: data.email,
              password: 'temp-whop-password' // We'll need to handle this better
            });

            if (signInError) {
              // If password sign-in fails, create a magic link
              const { error: magicLinkError } = await supabase.auth.signInWithOtp({
                email: data.email,
                options: {
                  emailRedirectTo: `${window.location.origin}/dashboard`
                }
              });

              if (magicLinkError) {
                throw magicLinkError;
              }

              toast({
                title: "Check your email",
                description: "We've sent you a magic link to complete your sign-in.",
              });
            }
          }

          setUserInfo({
            userId: data.user_id,
            email: data.email,
            exists: data.exists
          });
          setStatus('success');

          // Redirect after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          throw new Error(data.error || 'Authentication failed');
        }
      } catch (error) {
        console.error('Whop authentication error:', error);
        setStatus('error');
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: error instanceof Error ? error.message : "Please try again or contact support.",
        });
      }
    };

    handleWhopAuth();
  }, [searchParams, navigate, toast]);

  const StatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return {
          title: 'Setting up your account...',
          description: 'Please wait while we authenticate you with Whop and set up your LegalDeep AI access.'
        };
      case 'success':
        return {
          title: 'Welcome to LegalDeep AI!',
          description: userInfo?.exists 
            ? 'Welcome back! Redirecting you to your dashboard...'
            : 'Your account has been created successfully. Redirecting you to your dashboard...'
        };
      case 'error':
        return {
          title: 'Authentication failed',
          description: 'We encountered an issue setting up your account. Please try again or contact support.'
        };
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <StatusIcon />
          </div>
          <Badge className="mb-2 bg-blue-100 text-blue-700 border-blue-200 mx-auto">
            Whop Integration
          </Badge>
          <CardTitle className="text-xl">{statusMessage.title}</CardTitle>
          <CardDescription>{statusMessage.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {userInfo && status === 'success' && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{userInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="secondary" className="text-xs">
                  {userInfo.exists ? 'Existing User' : 'New User'}
                </Badge>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate('/auth')}
              >
                Go to Login Page
              </Button>
            </div>
          )}

          {status === 'success' && (
            <Button 
              className="w-full"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}