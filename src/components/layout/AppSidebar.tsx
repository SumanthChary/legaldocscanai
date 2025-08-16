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
import { useLocation } from "react-router-dom";
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
  { title: "Dashboard", tab: "dashboard", icon: LayoutDashboard },
  { title: "Upload Documents", tab: "upload", icon: Upload },
  { title: "Document Gallery", tab: "documents", icon: FileText },
  { title: "AI Law Genius", tab: "chat", icon: Bot },
  { title: "E-Signatures", tab: "esignatures", icon: PenTool },
  { title: "Analytics & Insights", tab: "insights", icon: BarChart3 },
];

const accountItems = [
  { title: "Profile Settings", tab: "profile", icon: User },
  { title: "Subscription", tab: "subscription", icon: CreditCard },
  { title: "Trash", tab: "trash", icon: Trash2 },
];

const enterpriseItems = [
  { title: "Team Management", tab: "team", icon: Users },
  { title: "Organization", tab: "organization", icon: Building },
  { title: "Security", tab: "security", icon: Shield },
  { title: "API Access", tab: "api", icon: Globe },
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
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export function AppSidebar({ user, profile, activeTab, onTabChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const isActive = (tab: string) => {
    return activeTab === tab;
  };

  const getNavClassName = (tab: string) => {
    return isActive(tab) 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";
  };

  const handleItemClick = (tab: string) => {
    onTabChange(tab);
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
      className={`${collapsed ? "w-12 md:w-16" : "w-64 md:w-72"} border-r bg-background/95 backdrop-blur-md transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarHeader className="p-3 md:p-4">
        {!collapsed && (
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative">
                <img 
                  alt="LegalDeep AI" 
                  className="h-6 w-6 md:h-8 md:w-8 object-contain rounded-lg" 
                  src="/lovable-uploads/dd1d70eb-890d-405e-af4a-dab180dc4bf5.png" 
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                LegalDeep AI
              </span>
              <span className="text-xs text-muted-foreground hidden md:block">Professional Suite</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <img 
              alt="LegalDeep AI" 
              className="h-6 w-6 md:h-8 md:w-8 object-contain rounded-lg" 
              src="/lovable-uploads/dd1d70eb-890d-405e-af4a-dab180dc4bf5.png" 
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-1 md:px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-xs md:text-sm"}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    className="h-10 md:h-11 p-0 cursor-pointer"
                    onClick={() => handleItemClick(item.tab)}
                  >
                    <div className={`${getNavClassName(item.tab)} flex items-center w-full h-full px-2 md:px-3 py-2 rounded-md transition-all duration-200`}>
                      <item.icon className={`${collapsed ? "h-4 w-4 md:h-5 md:w-5" : "h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3"} flex-shrink-0`} />
                      {!collapsed && <span className="font-medium text-sm md:text-base truncate">{item.title}</span>}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-3 md:my-4" />

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-xs md:text-sm"}>
            Account & Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    className="h-9 md:h-10 p-0 cursor-pointer"
                    onClick={() => handleItemClick(item.tab)}
                  >
                    <div className={`${getNavClassName(item.tab)} flex items-center w-full h-full px-2 md:px-3 py-2 rounded-md transition-all duration-200`}>
                      <item.icon className={`${collapsed ? "h-3 w-3 md:h-4 md:w-4" : "h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3"} flex-shrink-0`} />
                      {!collapsed && <span className="text-sm md:text-base truncate">{item.title}</span>}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-3 md:my-4" />

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-xs md:text-sm"}>
            Enterprise
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {enterpriseItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    className="h-9 md:h-10 p-0 cursor-pointer"
                    onClick={() => handleItemClick(item.tab)}
                  >
                    <div className={`${getNavClassName(item.tab)} flex items-center w-full h-full px-2 md:px-3 py-2 rounded-md transition-all duration-200`}>
                      <item.icon className={`${collapsed ? "h-3 w-3 md:h-4 md:w-4" : "h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3"} flex-shrink-0`} />
                      {!collapsed && <span className="text-sm md:text-base truncate">{item.title}</span>}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-3 md:my-4" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="h-9 md:h-10 p-0 cursor-pointer"
                  onClick={() => handleItemClick("subscription")}
                >
                  <div className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 flex items-center w-full h-full px-2 md:px-3 py-2 rounded-md transition-all duration-200">
                    <Star className={`${collapsed ? "h-3 w-3 md:h-4 md:w-4" : "h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3"} flex-shrink-0`} />
                    {!collapsed && <span className="text-sm md:text-base truncate">Upgrade to Pro</span>}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 md:p-4">
        {!collapsed && (
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg bg-muted/50">
              <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
                <AvatarImage src={avatarUrl} alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs md:text-sm">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate hidden md:block">{userEmail}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 md:h-auto text-xs md:text-sm"
            >
              <LogOut className="h-3 w-3 md:h-4 md:w-4 mr-2 md:mr-3" />
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        )}
        {collapsed && (
          <div className="flex flex-col space-y-1 md:space-y-2">
            <div className="flex justify-center">
              <Avatar className="h-6 w-6 md:h-8 md:w-8">
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
              className="w-full p-1 md:p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}