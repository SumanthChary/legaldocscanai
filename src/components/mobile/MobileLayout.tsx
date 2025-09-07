import { ReactNode } from "react";
import { MobileNavigation } from "./MobileNavigation";

interface MobileLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

export const MobileLayout = ({ children, showNavigation = true }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-safe">
        {children}
      </main>
      {showNavigation && <MobileNavigation />}
    </div>
  );
};