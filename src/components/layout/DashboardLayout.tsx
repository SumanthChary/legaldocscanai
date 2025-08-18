import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import { Footer } from "@/components/Footer";

type DashboardLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export const DashboardLayout = ({ children, className = "" }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${className}`}>
        <AppSidebar />
        <MobileSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-auto bg-background">
            <div className="p-4 md:p-6 lg:p-8 pb-20">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};