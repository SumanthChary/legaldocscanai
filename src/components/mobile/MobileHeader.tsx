import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  rightSlot?: ReactNode;
  onBack?: () => void;
  className?: string;
}

export const MobileHeader = ({
  title,
  subtitle,
  showBack = true,
  rightSlot,
  onBack,
  className,
}: MobileHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate(-1);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-slate-200/70 bg-[#F8FAFC]/95 px-4 pb-4 pt-5 backdrop-blur-md dark:border-slate-700/40 dark:bg-[#0D1117]/90",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleBack}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition dark:border-slate-700 dark:bg-transparent dark:text-white",
            !showBack && "pointer-events-none opacity-0",
          )}
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex flex-1 flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-inner">
              <span className="material-icons text-[20px]">shield</span>
            </span>
            <span className="font-display text-2xl italic tracking-tight text-slate-900 dark:text-white">
              LegalDeep AI
            </span>
          </div>
          {title && (
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-400">{title}</p>
          )}
          {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
        </div>

        <div className="flex min-h-11 min-w-[44px] items-center justify-end">
          {rightSlot ?? (
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-transparent dark:text-white" />
          )}
        </div>
      </div>
    </header>
  );
};