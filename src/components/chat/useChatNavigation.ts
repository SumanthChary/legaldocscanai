
import { useNavigate } from "react-router-dom";

export const useChatNavigation = () => {
  const navigate = useNavigate();

  const navigateToChat = () => {
    navigate("/chat");
  };

  return { navigateToChat };
};
