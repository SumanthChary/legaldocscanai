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
  Brain,
  Menu,
  X,
  Users,
  Building,
  Shield,
  Key
} from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useState } from "react";
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
    badge: "PRO"
  },
  { 
    title: "Analytics & Insights", 
    tab: "insights",
    icon: BarChart3,
    badge: null
  },
];

const enterpriseItems = [
  { 
    title: "Team Management", 
    tab: "team",
    icon: Users,
    badge: "SOON"
  },
  { 
    title: "Organization", 
    tab: "organization",
    icon: Building,
    badge: "SOON"
  },
  { 
    title: "Security", 
    tab: "security",
    icon: Shield,
    badge: "SOON"
  },
  { 
    title: "API Access", 
    tab: "api",
    icon: Key,
    badge: "SOON"
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

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const handleTabChange = (tab: string) => {
    navigate(`/dashboard?tab=${tab}`, { replace: true });
    setIsOpen(false);
  };

  const isActive = (tab: string) => {
    return activeTab === tab;
  };

  const getNavClassName = (tab: string) => {
    const active = isActive(tab);
    return `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer w-full
      ${active 
        ? "bg-primary text-primary-foreground shadow-md" 
        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      }
    `;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="xl:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="bg-background/95 backdrop-blur-sm border-border/50 shadow-lg"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="xl:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        xl:hidden fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur-md border-r border-border/50 z-50 transform transition-transform duration-300 shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                alt="LegalDeep AI" 
                className="h-8 w-8 object-contain rounded-lg" 
                src="/lovable-uploads/dd1d70eb-890d-405e-af4a-dab180dc4bf5.png" 
              />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              LegalDeep AI
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 p-4 h-full overflow-y-auto">
          {/* Main Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">Main Navigation</h3>
            <div className="space-y-2">
              {mainNavItems.map((item) => (
                <div 
                  key={item.title}
                  onClick={() => handleTabChange(item.tab)} 
                  className={getNavClassName(item.tab)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex items-center justify-between w-full min-w-0">
                    <span className="text-sm font-medium truncate">{item.title}</span>
                    {item.badge && (
                      <Badge 
                        variant={item.badge === "NEW" ? "default" : "secondary"} 
                        className="text-xs px-2 py-0.5 flex-shrink-0"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Section */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">Enterprise</h3>
            <div className="space-y-2">
              {enterpriseItems.map((item) => (
                <div 
                  key={item.title}
                  onClick={() => handleTabChange(item.tab)} 
                  className={getNavClassName(item.tab)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex items-center justify-between w-full min-w-0">
                    <span className="text-sm font-medium truncate">{item.title}</span>
                    {item.badge && (
                      <Badge 
                        variant="outline" 
                        className="text-xs px-2 py-0.5 text-muted-foreground flex-shrink-0"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Section */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">Account</h3>
            <div className="space-y-2">
              {accountItems.map((item) => (
                <div 
                  key={item.title}
                  onClick={() => {
                    navigate(item.url);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-muted-foreground hover:bg-muted/80 hover:text-foreground w-full"
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Section */}
          <div className="mt-auto pt-4 border-t border-border/50">
            <Button
              onClick={() => {
                navigate("/pricing");
                setIsOpen(false);
              }}
              className="w-full justify-start gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 rounded-xl py-3"
            >
              <Crown className="h-5 w-5 flex-shrink-0" />
              <div className="flex items-center justify-between w-full min-w-0">
                <span className="text-sm font-medium truncate">Upgrade to Pro</span>
                <Badge variant="secondary" className="bg-white text-orange-600 text-xs flex-shrink-0">
                  PRO
                </Badge>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}