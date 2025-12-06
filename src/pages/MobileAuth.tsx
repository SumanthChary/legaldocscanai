import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MobileLayout } from "@/components/mobile/MobileLayout";

export default function MobileAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        navigate("/");
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        const redirectUrl = `${window.location.origin}/`;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username: username || email.split('@')[0]
            }
          }
        });

        if (error) throw error;

        setSuccess("Account created! Please check your email to verify your account.");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
  };

  return (
    <MobileLayout showNavigation={false}>
      <div className="min-h-screen bg-[#f6f8f7] px-4 py-10">
        <div className="mx-auto flex max-w-md flex-col gap-6">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Shield className="h-8 w-8" />
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">LegalDeep Mobile</p>
            <h1 className="font-serif text-3xl italic text-slate-900">
              {isLogin ? "Secure access" : "Create your vault"}
            </h1>
            <p className="text-sm text-slate-500">
              Bank-grade sign in. Documents auto-delete after 24h.
            </p>
          </div>

          <Card className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg">
            <div className="flex flex-col gap-6">
              <Button
                onClick={handleGoogleAuth}
                disabled={loading}
                variant="outline"
                className="h-12 gap-3 rounded-2xl border-slate-200"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>

              <div className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-slate-400">
                <div className="h-px flex-1 bg-slate-200" />
                or email
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Username (optional)
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="h-12 rounded-2xl border-slate-200 bg-slate-50 pl-11"
                        required
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <Alert className="rounded-2xl border-red-200 bg-red-50">
                    <AlertDescription className="text-sm text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="rounded-2xl border-emerald-200 bg-emerald-50">
                    <AlertDescription className="text-sm text-emerald-700">{success}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full gap-2 rounded-2xl bg-primary text-base font-semibold text-white"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-slate-500">
                <Button variant="ghost" onClick={toggleMode} className="text-primary">
                  {isLogin ? "Need an account? Sign up" : "Already a member? Sign in"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}