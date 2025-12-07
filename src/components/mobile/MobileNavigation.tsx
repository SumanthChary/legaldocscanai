import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type NavItem = {
  icon: string;
  label: string;
  path: string;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { icon: "home", label: "Home", path: "/" },
  { icon: "history", label: "History", path: "/history" },
  { icon: "analytics", label: "Reports", path: "/reports" },
  { icon: "person_outline", label: "Profile", path: "/profile" },
  { icon: "settings", label: "Settings", path: "/settings" },
];

export const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActivePath = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto w-full max-w-sm px-4 pb-safe">
      <div className="relative rounded-t-[32px] border-t border-slate-200 bg-white/95 px-4 pb-6 pt-8 shadow-[0_-18px_60px_rgba(15,23,42,0.15)] backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 2).map((item) => {
            const active = isActivePath(item.path, item.exact);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-500 transition mobile-nav-item",
                  active && "text-emerald-600",
                )}
              >
                {active && <span className="absolute -top-3 h-1 w-8 rounded-full bg-emerald-500" />}
                <span className="material-icons-outlined text-[24px]">{item.icon}</span>
                <span className="uppercase tracking-wide">{item.label}</span>
              </button>
            );
          })}

          <div className="w-16" />

          {navItems.slice(2).map((item) => {
            const active = isActivePath(item.path, item.exact);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-500 transition mobile-nav-item",
                  active && "text-emerald-600",
                )}
              >
                {active && <span className="absolute -top-3 h-1 w-8 rounded-full bg-emerald-500" />}
                <span className="material-icons-outlined text-[24px]">{item.icon}</span>
                <span className="uppercase tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigate("/scan")}
          className="absolute -top-7 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/40"
          aria-label="Start scan"
        >
          <span className="material-icons text-[32px]">qr_code_scanner</span>
        </button>

        <div className="pointer-events-none mx-auto mt-6 h-1.5 w-24 rounded-full bg-slate-300/70" />
      </div>
    </nav>
  );
};