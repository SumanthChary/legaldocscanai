import { useState } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, Bot, User, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function MobileChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Law AI, your legal document assistant. I can help you understand legal documents, answer questions about contracts, and provide legal insights. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Please sign in to use the AI chat");
      }

      const { data: chatResult, error: chatError } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: currentInput,
          userId: user.id
        }
      });

      if (chatError) {
        throw new Error(`Chat failed: ${chatError.message}`);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: chatResult.response,
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);

      // Save to chat history
      try {
        await (supabase as any).from('chat_history').insert({
          user_id: user.id,
          message_text: currentInput,
          response_text: chatResult.response
        });
      } catch (historyError) {
        console.log('Chat history save failed:', historyError);
      }

    } catch (error: any) {
      console.error("Chat error:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <MobileLayout>
      <MobileHeader title="Law AI Assistant" showBack />
      
      <div className="flex flex-col h-[calc(100vh-180px)] bg-gradient-to-br from-background via-background/95 to-muted/20">
        {/* Chat Messages */}
        <div className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
          <div className="space-y-6 max-w-2xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "ai" && (
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/90 to-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] rounded-3xl px-5 py-4 shadow-sm ${
                    message.sender === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-auto"
                      : "bg-white/80 backdrop-blur-sm border border-border/30 text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-3 ${
                    message.sender === "user" 
                      ? "text-primary-foreground/60" 
                      : "text-muted-foreground"
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                
                {message.sender === "user" && (
                  <div className="w-10 h-10 bg-gradient-to-br from-muted to-muted/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/90 to-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/80 backdrop-blur-sm border border-border/30 rounded-3xl px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border/30 p-4 bg-white/80 backdrop-blur-xl">
          <Card className="border-0 bg-white/60 backdrop-blur-sm p-2 shadow-sm">
            <div className="flex items-end gap-3">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me about legal documents..."
                className="border-0 bg-transparent resize-none min-h-[44px] text-sm placeholder:text-muted-foreground/60"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                size="sm"
                className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-primary/90 hover:from-primary/95 hover:to-primary shadow-lg"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </Card>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs h-9 px-4 rounded-full bg-white/60 border-border/30 hover:bg-primary/5 hover:border-primary/20 shadow-sm backdrop-blur-sm"
              onClick={() => setInputText("Explain this contract clause")}
            >
              <Sparkles className="w-3 h-3 mr-2" />
              Explain Clause
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs h-9 px-4 rounded-full bg-white/60 border-border/30 hover:bg-primary/5 hover:border-primary/20 shadow-sm backdrop-blur-sm"
              onClick={() => setInputText("What are the key terms?")}
            >
              <MessageCircle className="w-3 h-3 mr-2" />
              Key Terms
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs h-9 px-4 rounded-full bg-white/60 border-border/30 hover:bg-primary/5 hover:border-primary/20 shadow-sm backdrop-blur-sm"
              onClick={() => setInputText("Review legal risks")}
            >
              <Bot className="w-3 h-3 mr-2" />
              Legal Risks
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}