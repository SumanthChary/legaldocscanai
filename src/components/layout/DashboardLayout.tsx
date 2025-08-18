import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export const DashboardLayout = ({ children, className = "" }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className={`h-screen flex w-full overflow-hidden ${className}`}>
        <AppSidebar />
        <MobileSidebar />
        <main className="flex-1 overflow-auto bg-background">
          <div className="h-full p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};