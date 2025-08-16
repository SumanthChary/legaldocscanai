import { useState } from "react";
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  Bot, 
  PenTool, 
  BarChart3, 
  Settings, 
  CreditCard, 
  Trash2, 
  Star,
  LogOut,
  User,
  Building,
  Users,
  Shield,
  Globe
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Upload Documents", url: "/dashboard?tab=upload", icon: Upload },
  { title: "Document Gallery", url: "/dashboard?tab=documents", icon: FileText },
  { title: "AI Law Genius", url: "/chat", icon: Bot },
  { title: "E-Signatures", url: "/esignatures", icon: PenTool },
  { title: "Analytics & Insights", url: "/dashboard?tab=insights", icon: BarChart3 },
];

const accountItems = [
  { title: "Profile Settings", url: "/profile", icon: User },
  { title: "Subscription", url: "/pricing", icon: CreditCard },
  { title: "Trash", url: "/profile?tab=trash", icon: Trash2 },
];

const enterpriseItems = [
  { title: "Team Management", url: "/team", icon: Users },
  { title: "Organization", url: "/organization", icon: Building },
  { title: "Security", url: "/security", icon: Shield },
  { title: "API Access", url: "/api", icon: Globe },
];

type AppSidebarProps = {
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
  profile?: {
    full_name?: string;
    avatar_url?: string;
  };
};

export function AppSidebar({ user, profile }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const currentPath = location.pathname + location.search;
  
  const isActive = (path: string) => {
    if (path === "/dashboard" && (currentPath === "/dashboard" || currentPath === "/" || currentPath === "/dashboard?tab=documents")) {
      return true;
    }
    if (path.includes("?tab=")) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: error.message,
        });
      } else {
        navigate("/");
        toast({
          title: "Signed out successfully",
          description: "You've been logged out of your account.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-72"} border-r bg-background/95 backdrop-blur-md`}
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Legal AI Pro
              </span>
              <span className="text-xs text-muted-foreground">Professional Suite</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className={`${collapsed ? "h-5 w-5" : "h-5 w-5 mr-3"}`} />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Account & Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className={`${collapsed ? "h-4 w-4" : "h-4 w-4 mr-3"}`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Enterprise
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {enterpriseItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className={`${collapsed ? "h-4 w-4" : "h-4 w-4 mr-3"}`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-10">
                  <NavLink to="/pricing" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                    <Star className={`${collapsed ? "h-4 w-4" : "h-4 w-4 mr-3"}`} />
                    {!collapsed && <span>Upgrade to Pro</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-3" />
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        )}
        {collapsed && (
          <div className="flex flex-col space-y-2">
            <div className="flex justify-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}