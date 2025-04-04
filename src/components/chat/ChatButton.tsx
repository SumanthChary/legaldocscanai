
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

type ChatButtonProps = {
  onClick: () => void;
};

export const ChatButton = ({ onClick }: ChatButtonProps) => {
  return (
    <Button 
      size="icon" 
      className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 animate-pulse hover:animate-none"
      onClick={onClick}
    >
      <MessageSquare className="h-7 w-7" />
    </Button>
  );
};
