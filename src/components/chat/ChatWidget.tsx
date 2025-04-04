
import { ChatButton } from "./ChatButton";
import { useChatNavigation } from "./useChatNavigation";

export const ChatWidget = () => {
  const { navigateToChat } = useChatNavigation();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ChatButton onClick={navigateToChat} />
    </div>
  );
};
