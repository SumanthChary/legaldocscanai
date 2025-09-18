import { Home, Plus, History, MessageCircle, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

    const navItems = [
      { icon: Home, label: "Home", path: "/" },
      { icon: History, label: "History", path: "/history" },
      { icon: Plus, label: "Scan", path: "/scan", isMain: true },
      { icon: MessageCircle, label: "Law AI", path: "/chat" },
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
              "flex flex-col items-center justify-center transition-all duration-300 min-w-[64px] mobile-tap",
              location.pathname === path
                ? "text-primary bg-primary/10 scale-105 shadow-sm"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5",
              isMain 
                ? "w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground hover:from-primary/95 hover:to-primary/85 scale-110 -mt-4 shadow-xl shadow-primary/25" 
                : "p-3 rounded-2xl"
            )}
          >
            <Icon size={isMain ? 24 : 18} className={isMain ? "drop-shadow-sm" : ""} />
            {!isMain && (
              <span className="text-[10px] mt-1 font-medium leading-none">
                {label}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};