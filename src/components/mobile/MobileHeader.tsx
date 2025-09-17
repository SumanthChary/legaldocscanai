import { ArrowLeft, MoreVertical, Scan } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  onMenuClick?: () => void;
  showAppName?: boolean;
}

export const MobileHeader = ({ 
  title, 
  showBack = false, 
  showMenu = false, 
  onMenuClick,
  showAppName = true 
}: MobileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-primary/10 hover:text-primary"
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          {showAppName && showBack && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Scan className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">LegalDoc Scanner</span>
            </div>
          )}
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
        </div>
        
        {showMenu && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="p-2"
          >
            <MoreVertical size={20} />
          </Button>
        )}
      </div>
    </header>
  );
};