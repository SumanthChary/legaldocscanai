
import { ChatButton } from "./ChatButton";
import { useChatNavigation } from "./useChatNavigation";

export const ChatWidget = () => {
  const { navigateToChat } = useChatNavigation();

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <ChatButton onClick={navigateToChat} />
    </div>
  );
};
