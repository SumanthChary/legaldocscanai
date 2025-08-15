import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SignInPage, Testimonial } from "@/components/ui/sign-in";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
        }
        if (session) {
          // User is already logged in, redirect to dashboard
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Unexpected error checking session:", error);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          toast({
            title: "Success!",
            description: "You have been signed in successfully.",
            duration: 3000,
          });
          
          // Small delay to ensure state is updated
          setTimeout(() => {
            navigate("/dashboard");
          }, 500);
        }
        
        if (event === 'USER_UPDATED') {
          toast({
            title: "Account Created!",
            description: "Please check your email to verify your account.",
            duration: 5000,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Get the current URL for redirect
        const redirectUrl = `${window.location.origin}/dashboard`;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username: username || email.split('@')[0],
            },
          },
        });
        
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Try signing in instead.",
              variant: "destructive",
            });
            setIsSignUp(false);
          } else {
            throw error;
          }
        } else if (data.user) {
          toast({
            title: "Success!",
            description: "Account created! Please check your email to verify your account.",
            duration: 5000,
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Sign in failed",
              description: "Invalid email or password. Please check your credentials and try again.",
              variant: "destructive",
            });
          } else if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Email not verified",
              description: "Please check your email and click the verification link before signing in.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else if (data.user) {
          // Success will be handled by onAuthStateChange
          console.log("Sign in successful for:", data.user.email);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubAuth = async () => {
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: redirectUrl,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("GitHub auth error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with GitHub. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sampleTestimonials: Testimonial[] = [
    {
      avatarSrc: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      name: "Sarah Chen",
      handle: "@sarahdigital",
      text: "LegalDeep AI transformed our contract review process. What used to take hours now takes minutes."
    },
    {
      avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      name: "Marcus Johnson",
      handle: "@marcustech",
      text: "The AI insights are incredibly accurate. It's like having a legal expert review every document."
    },
    {
      avatarSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      name: "David Martinez",
      handle: "@davidcreates",
      text: "Game-changer for our law firm. The analysis quality and speed are unmatched."
    },
  ];

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <SignInPage
        heroImageSrc="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=2160&q=80"
        testimonials={sampleTestimonials}
        onSignIn={handleEmailAuth}
        onGoogleSignIn={handleGithubAuth}
        onResetPassword={() => {
          toast({
            title: "Password Reset",
            description: "Password reset functionality will be available soon.",
          });
        }}
        onCreateAccount={() => setIsSignUp(!isSignUp)}
        isSignUp={isSignUp}
        isLoading={loading}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        username={username}
        setUsername={setUsername}
      />
    </div>
  );
};

export default Auth;
