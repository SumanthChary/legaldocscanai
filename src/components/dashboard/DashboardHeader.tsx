
import { Button } from "@/components/ui/button";
import { Book, FileText, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type DashboardHeaderProps = {
  userName: string;
  onTabChange?: (tab: string) => void;
};

export const DashboardHeader = ({ userName, onTabChange }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  
  const quickActions = [
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
      action: () => window.open("https://docs.legaldeepai.com", "_blank"),
      color: "text-purple-500"
    }
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          Welcome back, {userName}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Here's what's happening with your documents today.
        </p>
      </div>
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
    </div>
  );
};
