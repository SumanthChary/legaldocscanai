import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

type SidebarLayoutProps = {
  children: ReactNode;
  className?: string;
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

export const SidebarLayout = ({ children, className = "", user, profile, activeTab, onTabChange }: SidebarLayoutProps) => {
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-background ${className}`}>
        <AppSidebar user={user} profile={profile} activeTab={activeTab} onTabChange={onTabChange} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header with Sidebar Trigger */}
          <header className="lg:hidden border-b bg-background/95 backdrop-blur-md sticky top-0 z-40 p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-3">
                <Button variant="ghost" size="sm" className="p-1.5 md:p-2" asChild>
                  <SidebarTrigger>
                    <Menu className="h-4 w-4 md:h-5 md:w-5" />
                  </SidebarTrigger>
                </Button>
                <div className="flex items-center space-x-1.5 md:space-x-2">
                  <div className="relative">
                    <img 
                      alt="LegalDeep AI" 
                      className="h-5 w-5 md:h-6 md:w-6 object-contain rounded" 
                      src="/lovable-uploads/dd1d70eb-890d-405e-af4a-dab180dc4bf5.png" 
                    />
                  </div>
                  <span className="font-bold text-base md:text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    LegalDeep AI
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};