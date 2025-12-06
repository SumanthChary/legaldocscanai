import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Github, FileText, Shield, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Custom Google Icon component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        toast({
          title: "Success!",
          description: "You have been signed in successfully.",
        });

        setTimeout(() => navigate("/dashboard"), 500);
      }

      if (event === "USER_UPDATED") {
        toast({
          title: "Account created",
          description: "Please check your inbox to verify your account.",
          duration: 5000,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleEmailAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please fill in both email and password.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const redirectUrl = `${window.location.origin}/dashboard`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username: username || email.split("@")[0],
            },
          },
        });

        if (error) {
          if (error.message?.toLowerCase().includes("already")) {
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
            description: "Account created. Please verify using the email we sent.",
            duration: 5000,
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message?.toLowerCase().includes("invalid")) {
            toast({
              title: "Sign in failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else if (error.message?.toLowerCase().includes("email not confirmed")) {
            toast({
              title: "Email not verified",
              description: "Please verify your email before signing in.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        }
      }
    } catch (error: any) {
      console.error("Auth error", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubAuth = async () => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/dashboard`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("GitHub auth error", error);
      toast({
        title: "GitHub error",
        description: error.message || "Failed to sign in with GitHub.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/dashboard`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Google auth error", error);
      toast({
        title: "Google error",
        description: error.message || "Failed to sign in with Google.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f2f5f4]">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Checking session</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#f6f8f7] px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-3 text-center lg:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">LegalDeep AI</p>
          <h1 className="font-serif text-4xl italic text-slate-900 sm:text-5xl">
            Secure legal intelligence for modern teams
          </h1>
          <p className="text-base text-slate-500 sm:text-lg">
            Single sign-on, bank-grade encryption, and effortless onboarding for your entire workspace.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Platform overview</p>
                <p className="text-2xl font-semibold text-slate-900">Why legal teams switch</p>
              </div>
            </div>
            <p className="text-base leading-relaxed text-slate-600">
              Centralize contract analysis, redlines, and compliance notes with AI summaries tailored to your playbook. Invite co-counsel, track audit-ready history, and export reports in seconds.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-900 p-4 text-white">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">Process time</p>
                <p className="text-3xl font-black">6×</p>
                <p className="text-sm text-white/70">faster reviews</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-slate-900">
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-600">Accuracy</p>
                <p className="text-3xl font-black">89%</p>
                <p className="text-sm text-slate-500">clause coverage</p>
              </div>
              <div className="rounded-2xl border border-dashed border-slate-200 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Security</p>
                <p className="text-3xl font-black text-slate-900">SOC2</p>
                <p className="text-sm text-slate-500">bank-grade</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex min-w-[220px] flex-1 items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Zero-knowledge storage</p>
                  <p className="text-xs text-slate-500">Auto delete after 24h</p>
                </div>
              </div>
              <div className="flex min-w-[220px] flex-1 items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Team-ready seats</p>
                  <p className="text-xs text-slate-500">Invite reviewers & clients</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <Card className="w-full rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur">
              <div className="space-y-2 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                  {isSignUp ? "Create account" : "Sign in"}
                </p>
                <h2 className="font-serif text-3xl italic text-slate-900">
                  {isSignUp ? "Start scanning securely" : "Welcome back"}
                </h2>
                <p className="text-sm text-slate-500">
                  {isSignUp ? "AI copilots for every contract" : "Resume where you left off"}
                </p>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleEmailAuth}>
                {isSignUp && (
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Full name
                    </label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary"
                      placeholder="Samantha Clark"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Work email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary"
                    placeholder="founder@firm.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary"
                    placeholder="Min 6 characters"
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-2 h-12 w-full rounded-2xl bg-primary text-white shadow-primary/40 shadow-lg transition hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </div>
                  ) : (
                    isSignUp ? "Create secure workspace" : "Access workspace"
                  )}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-slate-400">
                <div className="h-px flex-1 bg-slate-200" />
                Continue with
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-2xl border-slate-200"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                >
                  <GoogleIcon className="mr-2 h-5 w-5" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-2xl border-slate-200"
                  onClick={handleGithubAuth}
                  disabled={loading}
                >
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Button>
              </div>

              <div className="mt-6 text-center text-sm text-slate-500">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-semibold text-primary"
                  disabled={loading}
                >
                  {isSignUp ? "Already onboarded? Sign in" : "Need an invite? Create one"}
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
