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
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ModernChatInput } from "./ModernChatInput";
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

type EnhancedChatPageProps = {
  user?: any;
  profile?: any;
};

export const EnhancedChatPage = ({ user, profile }: EnhancedChatPageProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI Legal Assistant. I can help you with legal research, document analysis, case law lookup, and more. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Contract Review Discussion",
      lastMessage: "What are the key risks in this agreement?",
      timestamp: new Date(Date.now() - 3600000),
      messageCount: 15
    },
    {
      id: "2", 
      title: "Employment Law Query",
      lastMessage: "Can you explain wrongful termination laws?",
      timestamp: new Date(Date.now() - 7200000),
      messageCount: 8
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string, files?: File[]) => {
    if (!message.trim() && (!files || files.length === 0)) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(message),
        isBot: true,
        timestamp: new Date(),
        sources: ["Civil Code Section 1542", "Case Law: Smith v. Jones (2023)", "Federal Regulation 29 CFR 1630"],
        documentRef: files && files.length > 0 ? files[0].name : undefined
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("contract") || message.includes("agreement")) {
      return "I can help you analyze contracts and agreements. Key elements to review include: 1) Terms and conditions, 2) Payment clauses, 3) Termination provisions, 4) Liability limitations, 5) Dispute resolution mechanisms. Would you like me to review a specific contract section or explain any of these elements in detail?";
    }
    
    if (message.includes("employment") || message.includes("job") || message.includes("workplace")) {
      return "Employment law covers various aspects including hiring practices, workplace safety, discrimination, wrongful termination, and wage and hour laws. The key federal laws include Title VII, ADA, FMLA, and FLSA. What specific employment law question can I help you with?";
    }
    
    if (message.includes("lawsuit") || message.includes("litigation") || message.includes("court")) {
      return "Litigation involves several stages: 1) Pleading phase (complaint, answer, motions), 2) Discovery (depositions, interrogatories, document requests), 3) Pre-trial motions, 4) Trial, and 5) Post-trial motions/appeals. The timeline can vary significantly based on case complexity and jurisdiction. What aspect of litigation would you like to explore?";
    }
    
    return "I understand you're looking for legal guidance. Could you provide more specific details about your situation? I can help with contract review, employment law, business formation, intellectual property, real estate transactions, and general legal research. The more context you provide, the better I can assist you.";
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Voice input activated",
        description: "Speak now to dictate your message",
      });
    }
  };

  const quickPrompts = [
    "Review this contract for potential risks",
    "Explain employment at-will doctrine",
    "What are the elements of a valid contract?",
    "Help me understand intellectual property basics",
    "Guide me through forming an LLC",
    "What should I know about data privacy laws?"
  ];

  const legalAreas = [
    { name: "Contract Law", icon: FileText, description: "Agreement analysis and review" },
    { name: "Employment Law", icon: Users, description: "Workplace rights and regulations" },
    { name: "Business Formation", icon: Building, description: "Corporate structure and compliance" },
    { name: "Intellectual Property", icon: Zap, description: "Patents, trademarks, copyrights" },
    { name: "Real Estate", icon: Home, description: "Property transactions and disputes" },
    { name: "Litigation Support", icon: Gavel, description: "Court procedures and strategies" }
  ];

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
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Button variant="outline" size="sm">
                  <History className="h-4 w-4 mr-2" />
                  Chat History
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Chat
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">AI Responses</p>
                    <p className="text-xl font-bold">1,247</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Search className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Research Queries</p>
                    <p className="text-xl font-bold">342</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Documents Analyzed</p>
                    <p className="text-xl font-bold">89</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Chat Interface */}
          <Card className="flex-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="p-4 border-b">
                <TabsList className="grid grid-cols-4 bg-muted/50 p-1 h-12">
                  <TabsTrigger value="chat" className="data-[state=active]:bg-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="research" className="data-[state=active]:bg-white">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Research
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="data-[state=active]:bg-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="sessions" className="data-[state=active]:bg-white">
                    <History className="h-4 w-4 mr-2" />
                    Sessions
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="chat" className="flex-1 flex flex-col p-0">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={{
                      id: message.id,
                      content: message.text,
                      sender: message.isBot ? "ai" : "user",
                      timestamp: message.timestamp
                    }} />
                  ))}
                  {isLoading && (
                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50">
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white animate-pulse" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                <div className="px-6 py-3 border-t bg-muted/20">
                  <p className="text-sm font-medium mb-3">Quick Legal Questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.slice(0, 3).map((prompt, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSendMessage(prompt)}
                        className="text-xs"
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-6 border-t">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50">
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">AI Legal Assistant</p>
                        <p className="text-xs text-muted-foreground">Ready to help with legal questions and document analysis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="research" className="flex-1 p-6">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input 
                      placeholder="Search legal cases, statutes, regulations..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                      <Search className="h-4 w-4 mr-2" />
                      Research
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {legalAreas.map((area, index) => (
                      <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <area.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <h3 className="font-semibold">{area.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{area.description}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="flex-1 p-6">
                <div className="text-center py-12">
                  <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4">
                    <FileUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Document Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload documents for AI-powered legal analysis and insights
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="sessions" className="flex-1 p-6">
                <div className="space-y-4">
                  {chatSessions.map((session) => (
                    <Card key={session.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{session.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{session.lastMessage}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{session.messageCount} messages</span>
                            <span>{session.timestamp.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{session.messageCount}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};