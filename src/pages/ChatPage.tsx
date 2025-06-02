
import { useState, useRef, useEffect } from "react";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X, Bot, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Please sign in to use the AI chat");
      }

      // Handle file upload if present
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

      // Send message to AI chat
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-200px)]">
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  AI Legal Assistant
                </h1>
                <p className="text-gray-600">Professional legal document analysis and consultation</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-6 mb-6 space-y-6 scrollbar-hide">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                  <div className={`p-2 rounded-xl ${
                    message.sender === "user" 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600" 
                      : "bg-gray-100"
                  }`}>
                    {message.sender === "user" ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl p-4 shadow-sm ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.fileName && (
                      <div className="text-xs mt-2 flex items-center opacity-80">
                        <Paperclip className="h-3 w-3 mr-1" />
                        {message.fileName}
                      </div>
                    )}
                    <div className={`text-xs mt-2 opacity-70 ${
                      message.sender === "user" ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="p-2 rounded-xl bg-gray-100">
                    <Bot className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-gray-500 ml-2">AI is analyzing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {file && (
            <div className="mb-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center text-sm">
                <Paperclip className="h-4 w-4 mr-2 text-blue-600" />
                <span className="truncate max-w-[200px] font-medium">{file.name}</span>
                <span className="ml-2 text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-red-50 hover:text-red-600" 
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={triggerFileInput}
              className="h-12 w-12 border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about legal documents, contracts, compliance..."
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                className="min-h-[48px] max-h-32 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm resize-none scrollbar-hide"
                rows={1}
              />
            </div>
            <Button 
              size="default" 
              onClick={handleSend} 
              disabled={isLoading} 
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ChatPage;
