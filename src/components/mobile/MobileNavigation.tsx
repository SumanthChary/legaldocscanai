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
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 pb-safe">
      <div className="flex items-center justify-around">
        {navItems.map(({ icon: Icon, label, path, isMain }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200",
              location.pathname === path
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground",
              isMain && "bg-primary text-primary-foreground hover:bg-primary/90 scale-110 -mt-2"
            )}
          >
            <Icon size={isMain ? 24 : 20} />
            <span className={cn("text-xs mt-1", isMain && "font-medium")}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};