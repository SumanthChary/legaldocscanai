import { useState } from "react";
import { 
  LayoutDashboard, 
  Upload, 
  FolderOpen, 
  MessageSquare, 
  FileSignature, 
  BarChart3, 
  Settings, 
  CreditCard, 
  Trash2, 
  Crown,
  FileText,
  Target,
  TrendingUp,
  Brain
} from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mainNavItems = [
  { 
    title: "Dashboard", 
    tab: "overview",
    icon: LayoutDashboard,
    badge: null
  },
  { 
    title: "Upload Documents", 
    tab: "upload",
    icon: Upload,
    badge: "NEW"
  },
  { 
    title: "Document Gallery", 
    tab: "documents",
    icon: FolderOpen,
    badge: null
  },
  { 
    title: "AI Law Genius", 
    tab: "chat",
    icon: Brain,
    badge: "SMART"
  },
  { 
    title: "E-Signatures", 
    tab: "esignatures",
    icon: FileSignature,
    badge: "BETA"
  },
  { 
    title: "Analytics & Insights", 
    tab: "insights",
    icon: BarChart3,
    badge: null
  },
];

const accountItems = [
  { 
    title: "Account Settings", 
    url: "/profile", 
    icon: Settings,
    badge: null
  },
  { 
    title: "Subscriptions", 
    url: "/pricing", 
    icon: CreditCard,
    badge: null
  },
  { 
    title: "Trash", 
    url: "/profile?tab=trash", 
    icon: Trash2,
    badge: null
  },
];

const upgradeItems = [
  { 
    title: "Upgrade to Pro", 
    url: "/pricing", 
    icon: Crown,
    badge: "PRO"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const handleTabChange = (tab: string) => {
    navigate(`/dashboard?tab=${tab}`, { replace: true });
  };

  const isActive = (tab: string) => {
    return activeTab === tab;
  };

  const getNavClassName = (tab: string) => {
    const active = isActive(tab);
    return `
      flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer
      ${active 
        ? "bg-primary text-primary-foreground shadow-sm" 
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }
    `;
  };

  return (
    <Sidebar
      className={`transition-all duration-300 border-r ${collapsed ? "w-16" : "w-64"} hidden md:flex`}
      collapsible="icon"
    >
      {/* Logo Section */}
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img 
              alt="LegalDeep AI" 
              className="h-8 w-8 object-contain rounded-lg" 
              src="/lovable-uploads/dd1d70eb-890d-405e-af4a-dab180dc4bf5.png" 
            />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              LegalDeep AI
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-4 p-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div 
                      onClick={() => handleTabChange(item.tab)} 
                      className={getNavClassName(item.tab)}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-medium">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.badge === "NEW" ? "default" : "secondary"} 
                              className="text-xs px-1.5 py-0.5"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div 
                      onClick={() => navigate(item.url)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="text-sm font-medium">{item.title}</span>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Upgrade Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {upgradeItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Button
                      onClick={() => navigate(item.url)}
                      className={`
                        w-full justify-start gap-3 bg-gradient-to-r from-amber-500 to-orange-500 
                        hover:from-amber-600 hover:to-orange-600 text-white border-0
                        ${collapsed ? "px-2" : "px-3"}
                      `}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-medium">{item.title}</span>
                          <Badge variant="secondary" className="bg-white text-orange-600 text-xs">
                            {item.badge}
                          </Badge>
                        </div>
                      )}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Toggle for Desktop */}
      <SidebarFooter className="border-t p-2">
        <SidebarTrigger className="w-full justify-center" />
      </SidebarFooter>
    </Sidebar>
  );
}