import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Upload, 
  FileText, 
  Gavel, 
  Search, 
  BookOpen, 
  MessageSquare,
  Mic,
  MicOff,
  Download,
  Share,
  History,
  Settings,
  Zap,
  Users,
  FileUp,
  Building,
  Home
} from "lucide-react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  sources?: string[];
  documentRef?: string;
};

type ChatSession = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
};

export const EnhancedChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const legalCategories = [
    { name: "Contract Analysis", icon: FileText, description: "Review and analyze legal contracts" },
    { name: "Legal Research", icon: BookOpen, description: "Find relevant case law and statutes" },
    { name: "Document Drafting", icon: FileUp, description: "Generate legal documents and templates" },
    { name: "Compliance Check", icon: Gavel, description: "Verify regulatory compliance" },
    { name: "Business Formation", icon: Building, description: "Corporate structure and compliance" },
    { name: "Intellectual Property", icon: Zap, description: "Patents, trademarks, copyrights" },
    { name: "Real Estate", icon: Home, description: "Property transactions and disputes" },
    { name: "Litigation Support", icon: Gavel, description: "Court procedures and strategies" }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message, context: "legal" }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I apologize, but I couldn't process your request at the moment.",
        isBot: true,
        timestamp: new Date(),
        sources: data.sources || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setSelectedSession(null);
    toast({
      title: "New chat started",
      description: "Ready for your legal questions!"
    });
  };

  const renderWelcomeScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="h-20 w-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Bot className="h-10 w-10 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Law AI Genius
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Your intelligent legal assistant for research, analysis, and document review
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {legalCategories.map((category) => (
            <Card 
              key={category.name} 
              className="p-4 hover:bg-muted/50 cursor-pointer transition-all group border-2 hover:border-primary/20"
              onClick={() => handleSendMessage(`I need help with ${category.name.toLowerCase()}`)}
            >
              <category.icon className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2 group-hover:text-primary">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => handleSendMessage("What legal services can you help me with?")}>
            <MessageSquare className="h-5 w-5 mr-2" />
            Ask a Legal Question
          </Button>
          <Button variant="outline" size="lg" onClick={() => setActiveTab("research")}>
            <Search className="h-5 w-5 mr-2" />
            Legal Research
          </Button>
        </div>
      </div>
    </div>
  );

  const renderChatContent = () => (
    <div className="flex-1 flex flex-col bg-card/50 rounded-lg border">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">AI Chat Assistant</h2>
        <Button variant="outline" size="sm" onClick={startNewChat}>
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? renderWelcomeScreen() : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.isBot 
                    ? 'bg-muted text-foreground' 
                    : 'bg-primary text-primary-foreground'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="p-4 border-t bg-background/95">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Textarea
              placeholder="Ask me anything about legal matters..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputMessage);
                }
              }}
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsListening(!isListening)}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 flex flex-col">
      <div className="flex-1 container mx-auto px-4 lg:px-8 py-6 flex flex-col">
        
        {/* Enhanced Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Law AI Genius
              </h1>
              <p className="text-muted-foreground">
                Advanced legal research and document analysis assistant
              </p>
            </div>
            <div className="flex space-x-2 mt-4 lg:mt-0">
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                Chat History
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm border-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b p-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  AI Chat
                </TabsTrigger>
                <TabsTrigger value="research" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Research
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="tools" className="flex items-center gap-2">
                  <Gavel className="h-4 w-4" />
                  Tools
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
              {renderChatContent()}
            </TabsContent>

            <TabsContent value="research" className="flex-1 p-6">
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Legal Research Portal</h3>
                <p className="text-muted-foreground mb-6">
                  Search through legal databases, case law, and statutes
                </p>
                <div className="max-w-md mx-auto">
                  <Input placeholder="Search legal cases, statutes, regulations..." className="mb-4" />
                  <Button className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Search Legal Database
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="flex-1 p-6">
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Document Analysis</h3>
                <p className="text-muted-foreground mb-6">
                  Upload legal documents for AI-powered analysis and insights
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {legalCategories.map((category) => (
                  <Card key={category.name} className="p-6 hover:bg-muted/50 cursor-pointer transition-all">
                    <category.icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Access Tool
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};