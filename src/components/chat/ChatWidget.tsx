
import { ChatButton } from "./ChatButton";
import { useChatNavigation } from "./useChatNavigation";
import { useLocation } from "react-router-dom";

export const ChatWidget = () => {
  const { navigateToChat } = useChatNavigation();
  const location = useLocation();

  // Don't show the widget on the chat page itself
  if (location.pathname === "/chat") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
      <ChatButton onClick={navigateToChat} />
    </div>
  );
};
