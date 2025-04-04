
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ChatWidget = () => {
  const navigate = useNavigate();

  const handleOpenChat = () => {
    navigate("/chat");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        size="icon" 
        className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 animate-pulse hover:animate-none"
        onClick={handleOpenChat}
      >
        <MessageSquare className="h-7 w-7" />
      </Button>
    </div>
  );
};
