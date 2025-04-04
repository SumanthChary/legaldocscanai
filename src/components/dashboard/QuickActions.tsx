
import { Book, FileText, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type QuickAction = {
  title: string;
  icon: React.ElementType;
  action: () => void;
  color: string;
};

type QuickActionsProps = {
  onTabChange?: (tab: string) => void;
};

export const QuickActions = ({ onTabChange }: QuickActionsProps) => {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      title: "New Analysis",
      icon: FileText,
      action: () => navigate("/document-analysis"),
      color: "text-blue-500"
    },
    {
      title: "View Documents",
      icon: Book,
      action: () => onTabChange?.("documents"),
      color: "text-green-500"
    },
    {
      title: "Documentation",
      icon: HelpCircle,
      action: () => navigate("/documentation"),
      color: "text-purple-500"
    },
    {
      title: "Coming Soon",
      icon: Sparkles,
      action: () => navigate("/upcoming-features"),
      color: "text-amber-500"
    }
  ];

  return (
    <div className="flex flex-wrap gap-2 md:gap-3 justify-start md:justify-end">
      {quickActions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          className="flex items-center gap-2 text-xs md:text-sm w-full sm:w-auto"
          onClick={action.action}
        >
          <action.icon className={`h-4 w-4 ${action.color}`} />
          {action.title}
        </Button>
      ))}
    </div>
  );
};
