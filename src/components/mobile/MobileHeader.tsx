import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export const MobileHeader = ({ 
  title, 
  showBack = false, 
  showMenu = false, 
  onMenuClick 
}: MobileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
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