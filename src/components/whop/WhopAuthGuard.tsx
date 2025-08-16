import { useEffect, useState } from 'react';
import { WhopService } from '@/integrations/whop';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { User, Session } from '@supabase/supabase-js';

interface WhopAuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const WhopAuthGuard = ({ children, fallback }: WhopAuthGuardProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isWhopUser, setIsWhopUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user came from Whop
    const fromWhop = WhopService.isWhopUser();
    setIsWhopUser(fromWhop);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated and came from Whop, show special message
  if (!user && isWhopUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
          Welcome from Whop!
        </Badge>
        <h2 className="text-2xl font-bold mb-2">Complete Your Setup</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Please complete the authentication process to access your LegalDeep AI account.
        </p>
        {fallback}
      </div>
    );
  }

  // If user is not authenticated and not from Whop, show regular fallback
  if (!user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to access this content.</p>
      </div>
    );
  }

  return <>{children}</>;
};