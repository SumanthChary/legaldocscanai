import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, User, LogOut, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Header = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        fetchProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      navigate("/");
    }
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-accent" />
            <span className="text-xl font-semibold text-primary">LegalBriefAI</span>
          </div>
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[385px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/features");
                      setIsOpen(false);
                    }}
                    className="justify-start"
                  >
                    Features
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/pricing");
                      setIsOpen(false);
                    }}
                    className="justify-start"
                  >
                    Pricing
                  </Button>
                  {session ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate("/dashboard");
                          setIsOpen(false);
                        }}
                        className="justify-start"
                      >
                        Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate("/profile");
                          setIsOpen(false);
                        }}
                        className="justify-start"
                      >
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        className="justify-start text-red-500"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      onClick={() => {
                        navigate("/auth");
                        setIsOpen(false);
                      }}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/features")}
              className="text-gray-600 hover:text-primary"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/pricing")}
              className="text-gray-600 hover:text-primary"
            >
              Pricing
            </Button>
            {session ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-600 hover:text-primary"
                >
                  Dashboard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{profile?.username || "Profile"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="default" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};