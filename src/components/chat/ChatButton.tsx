
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

type ChatButtonProps = {
  onClick: () => void;
};

export const ChatButton = ({ onClick }: ChatButtonProps) => {
  return (
    <Button 
      size="icon" 
      className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 hover:scale-110 transition-all duration-300 group ring-4 ring-blue-100 hover:ring-blue-200"
      onClick={onClick}
    >
      <MessageSquare className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
    </Button>
  );
};
