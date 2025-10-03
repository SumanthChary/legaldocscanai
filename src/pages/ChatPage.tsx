import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { ModernChatInput } from "@/components/chat/ModernChatInput";
import { TeamChat } from "@/components/chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatHistorySidebar } from "@/components/chat/ChatHistorySidebar";
import { PanelLeftClose, PanelLeft } from "lucide-react";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI legal assistant. I can help you analyze legal documents, answer questions about legal concepts, and provide detailed insights about your uploaded documents. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("ai-chat");
  const [showHistory, setShowHistory] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setCurrentUser({ ...user, profile });
      }
    };
    loadUser();
  }, []);

  const startNewChat = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your AI legal assistant. How can I assist you today?",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "New chat started",
      description: "Your previous chat has been saved to history.",
    });
  };

  const handleLoadChat = (loadedMessages: Message[]) => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your AI legal assistant. How can I assist you today?",
        sender: "ai",
        timestamp: new Date(),
      },
      ...loadedMessages,
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      fileName: file?.name,
    };
    setMessages((prev) => [...prev, userMessage]);
    
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Please sign in to use the AI chat");
      }

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const { data: uploadResult, error: uploadError } = await supabase.functions.invoke('analyze-document', {
          body: formData
        });

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        toast({
          title: "File uploaded and analyzed",
          description: `${file.name} has been processed successfully.`,
        });
        
        setFile(null);
      }

      const { data: chatResult, error: chatError } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: currentInput || `I just uploaded a file: ${file?.name}. Please analyze it and tell me about it.`,
          userId: user.id
        }
      });

      if (chatError) {
        throw new Error(`Chat failed: ${chatError.message}`);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: chatResult.response,
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);

      // Save to chat history
      try {
        await (supabase as any).from('chat_history').insert({
          user_id: user.id,
          message_text: currentInput || `I just uploaded a file: ${file?.name}. Please analyze it and tell me about it.`,
          response_text: chatResult.response
        });
      } catch (historyError) {
        console.log('Chat history save failed:', historyError);
      }

    } catch (error) {
      console.error("Chat error:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I encountered an error: ${error.message}. Please try again or contact support if the issue persists.`,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/10">
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">💬</span>
              </div>
              Chat Dashboard
            </CardTitle>
          </CardHeader>
          <div className="px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai-chat">AI Assistant</TabsTrigger>
                <TabsTrigger value="team-chat" disabled={!currentUser?.profile?.organization_id}>
                  Team Chat {!currentUser?.profile?.organization_id && "(Join Organization)"}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai-chat" className="mt-6">
                <div className="h-[600px] bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/10 rounded-lg border overflow-hidden">
                  <div className="flex h-full">
                    {/* Chat History Sidebar */}
                    {showHistory && (
                      <div className="w-80 flex-shrink-0">
                        <ChatHistorySidebar 
                          onLoadChat={handleLoadChat}
                          currentUserId={currentUser?.id}
                        />
                      </div>
                    )}
                    
                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex-shrink-0 px-6 pt-6 flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setShowHistory(!showHistory)}
                          >
                            {showHistory ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
                          </Button>
                          <ChatHeader />
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={startNewChat}
                        >
                          New Chat
                        </Button>
                      </div>
                      
                      <div className="flex-1 flex flex-col min-h-0 px-6">
                        <MessageList messages={messages} isLoading={isLoading} />
                      </div>
                      
                      <ModernChatInput 
                        input={input}
                        setInput={setInput}
                        onSend={handleSend}
                        isLoading={isLoading}
                        file={file}
                        onFileChange={handleFileChange}
                        onFileRemove={removeFile}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="team-chat" className="mt-6">
                {currentUser?.profile?.organization_id ? (
                  <TeamChat />
                ) : (
                  <Card>
                    <div className="p-8 text-center">
                      <h3 className="text-lg font-semibold mb-4">Join an Organization</h3>
                      <p className="text-muted-foreground mb-6">
                        Team chat is available when you're part of an organization. 
                        Create or join an organization to start collaborating with your team.
                      </p>
                      <div className="space-y-4">
                        <Button 
                          onClick={async () => {
                            try {
                              const { data, error } = await supabase.rpc('create_organization_with_owner', {
                                org_name: `${currentUser?.profile?.username}'s Organization`,
                                org_description: 'Demo organization for team collaboration'
                              });
                              
                              if (error) throw error;
                              
                              // Reload user data to get updated organization_id
                              const { data: updatedProfile } = await supabase
                                .from('profiles')
                                .select('*')
                                .eq('id', currentUser.id)
                                .single();
                              
                              setCurrentUser({ ...currentUser, profile: updatedProfile });
                              
                              toast({
                                title: "Success",
                                description: "Organization created successfully!"
                              });
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to create organization",
                                variant: "destructive"
                              });
                            }
                          }}
                        >
                          Create Demo Organization
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          This will create a demo organization so you can test the team chat features.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
