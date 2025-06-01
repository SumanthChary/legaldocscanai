
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

type ChatButtonProps = {
  onClick: () => void;
};

export const ChatButton = ({ onClick }: ChatButtonProps) => {
  return (
    <Button 
      size="icon" 
      className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 hover:scale-105 transition-all duration-300 group"
      onClick={onClick}
    >
      <MessageSquare className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
    </Button>
  );
};
