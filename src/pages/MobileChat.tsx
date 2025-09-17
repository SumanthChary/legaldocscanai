import { useState } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, Bot, User, Sparkles } from "lucide-react";

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

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand your question about legal documents. Based on the context you've provided, I can offer the following insights... [This is a demo response. In a real implementation, this would connect to a legal AI service.]",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <MobileLayout>
      <MobileHeader title="Law AI Assistant" showBack />
      
      <div className="flex flex-col h-[calc(100vh-180px)]">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "ai" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === "user" 
                      ? "text-primary-foreground/70" 
                      : "text-muted-foreground"
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                
                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border/50 p-4 bg-background/95 backdrop-blur-md">
          <Card className="border-0 bg-muted/30 p-1">
            <div className="flex items-end gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me about legal documents..."
                className="border-0 bg-transparent resize-none min-h-[44px] text-sm"
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
                className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs h-8 rounded-full bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/20"
              onClick={() => setInputText("Explain this contract clause")}
            >
              <Sparkles className="w-3 h-3 mr-1.5" />
              Explain Clause
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs h-8 rounded-full bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/20"
              onClick={() => setInputText("What are the key terms?")}
            >
              <MessageCircle className="w-3 h-3 mr-1.5" />
              Key Terms
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs h-8 rounded-full bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/20"
              onClick={() => setInputText("Review legal risks")}
            >
              <Bot className="w-3 h-3 mr-1.5" />
              Legal Risks
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}