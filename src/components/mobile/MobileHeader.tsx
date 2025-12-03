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
    if (!showBack) return;
    if (onBack) {
      onBack();
      return;
    }
    navigate(-1);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-slate-200/70 bg-[#F8FAFC]/95 px-4 pb-3 pt-4 backdrop-blur-md dark:border-slate-700/40 dark:bg-[#0D1117]/85",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleBack}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm dark:border-slate-700 dark:bg-transparent dark:text-white",
            !showBack && "pointer-events-none opacity-0",
          )}
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">
            LegalDeep AI
          </p>
          <p className="instrument-serif-regular-italic text-2xl text-slate-900 dark:text-white">
            LegalDeep AI App
          </p>
          {title && (
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-300">{title}</p>
          )}
          {subtitle && <p className="text-[11px] text-slate-400 dark:text-slate-400">{subtitle}</p>}
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