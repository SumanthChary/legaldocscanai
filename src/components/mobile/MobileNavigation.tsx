import { Home, Scan, History, User, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

    const navItems = [
      { icon: Home, label: "Home", path: "/" },
      { icon: History, label: "History", path: "/history" },
      { icon: Scan, label: "Scan", path: "/scan", isMain: true },
      { icon: User, label: "Profile", path: "/profile" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50 px-2 py-2 pb-safe shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(({ icon: Icon, label, path, isMain }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 min-w-[60px] mobile-tap",
              location.pathname === path
                ? "text-primary bg-primary/10 scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              isMain && "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 scale-110 -mt-3 shadow-lg shadow-primary/20"
            )}
          >
            <Icon size={isMain ? 26 : 22} className={isMain ? "drop-shadow-sm" : ""} />
            <span className={cn(
              "text-xs mt-1 font-medium",
              isMain && "text-primary-foreground font-semibold drop-shadow-sm"
            )}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};