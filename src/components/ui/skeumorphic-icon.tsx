import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SkeumorphicIconProps {
  icon: LucideIcon;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "upload" | "process" | "result" | "action";
  glowing?: boolean;
}

export const SkeumorphicIcon = ({
  icon: Icon,
  className,
  size = "md",
  variant = "upload",
  glowing = false
}: SkeumorphicIconProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-24 h-24"
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9",
    xl: "w-11 h-11"
  };

  const variantStyles = {
    upload: {
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      shadow: "shadow-[0_8px_32px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)]",
      icon: "text-white",
      glow: "before:shadow-[0_0_40px_rgba(59,130,246,0.6)]"
    },
    process: {
      bg: "bg-gradient-to-br from-purple-500 to-purple-600",
      shadow: "shadow-[0_8px_32px_rgba(147,51,234,0.3),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)]",
      icon: "text-white",
      glow: "before:shadow-[0_0_40px_rgba(147,51,234,0.6)]"
    },
    result: {
      bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      shadow: "shadow-[0_8px_32px_rgba(16,185,129,0.3),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)]",
      icon: "text-white",
      glow: "before:shadow-[0_0_40px_rgba(16,185,129,0.6)]"
    },
    action: {
      bg: "bg-gradient-to-br from-orange-500 to-orange-600",
      shadow: "shadow-[0_8px_32px_rgba(249,115,22,0.3),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)]",
      icon: "text-white",
      glow: "before:shadow-[0_0_40px_rgba(249,115,22,0.6)]"
    }
  };

  const style = variantStyles[variant];

  return (
    <div className={cn(
      "relative rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1",
      sizeClasses[size],
      style.bg,
      style.shadow,
      glowing && "animate-pulse",
      className
    )}>
      {/* Glow effect when enabled */}
      {glowing && (
        <div className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          style.glow
        )} />
      )}
      
      {/* Inner highlight */}
      <div className="absolute top-1 left-1 right-1 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-xl" />
      
      {/* Icon */}
      <Icon className={cn(iconSizes[size], style.icon, "relative z-10")} strokeWidth={1.5} />
    </div>
  );
};