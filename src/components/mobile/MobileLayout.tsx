import { ReactNode } from "react";
import { MobileNavigation } from "./MobileNavigation";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  className?: string;
  tone?: "light" | "dark";
}

export const MobileLayout = ({ children, showNavigation = true, className, tone = "light" }: MobileLayoutProps) => {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "min-h-screen w-full bg-gradient-to-b from-[#F8FAFC] via-[#f2fbf7] to-[#e5f5ec] text-slate-900",
        isDark && "bg-[#010704] text-white",
      )}
    >
      <div
        className={cn(
          "mx-auto flex min-h-screen w-full max-w-sm flex-col bg-[#F8FAFC] shadow-[0_20px_70px_rgba(15,23,42,0.15)] backdrop-blur-lg dark:bg-[#0F172A]",
          className,
        )}
      >
        <main className={cn("flex-1 pb-safe px-0", showNavigation && "pb-32")}>{children}</main>
        {showNavigation && <MobileNavigation />}
      </div>
    </div>
  );
};