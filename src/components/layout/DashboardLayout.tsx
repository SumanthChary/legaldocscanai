import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type DashboardLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export const DashboardLayout = ({ children, className = "" }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex flex-col w-full ${className}`}>
        {/* Header with Sidebar Trigger */}
        <Header />

        {/* Main Layout */}
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </SidebarProvider>
  );
};