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
};

export const SidebarLayout = ({ children, className = "", user, profile }: SidebarLayoutProps) => {
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-background ${className}`}>
        <AppSidebar user={user} profile={profile} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header with Sidebar Trigger */}
          <header className="lg:hidden border-b bg-background/95 backdrop-blur-md sticky top-0 z-40 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="p-2" asChild>
                  <SidebarTrigger>
                    <Menu className="h-5 w-5" />
                  </SidebarTrigger>
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs font-bold">L</span>
                  </div>
                  <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Legal AI Pro
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};