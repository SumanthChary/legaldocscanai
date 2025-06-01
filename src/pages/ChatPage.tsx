
import { useState, useRef, useEffect } from "react";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, X, Bot, User, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
      content: "Hello! I'm your AI legal assistant powered by advanced language models. I can help you analyze legal documents, answer questions about legal concepts, and provide detailed insights. How can I assist you today?",
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
    setInput("");
    setIsLoading(true);

    if (file) {
      try {
        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "There was an error uploading your file.",
        });
      }
    }

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: file 
          ? `I've analyzed the document "${file?.name}". This appears to be a legal document that requires careful review. Based on my analysis, I can provide insights on key clauses, potential risks, compliance requirements, and recommendations for action. Would you like me to focus on any specific aspects?` 
          : generateResponse(input),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
      setFile(null);
    }, 1000);
  };

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hello! I'm here to help with your legal document analysis and questions. I can review contracts, explain legal terms, identify key clauses, and provide strategic insights. What would you like to work on?";
    } else if (lowerInput.includes("contract") || lowerInput.includes("agreement")) {
      return "I can help you analyze contracts and agreements. I'll review key terms, identify potential risks, check for missing clauses, and provide recommendations. Please upload your document or ask specific questions about contract elements.";
    } else if (lowerInput.includes("compliance") || lowerInput.includes("regulation")) {
      return "I can assist with compliance analysis and regulatory review. I'll help identify applicable regulations, compliance requirements, potential violations, and recommended actions. What specific compliance area are you concerned about?";
    } else if (lowerInput.includes("risk") || lowerInput.includes("liability")) {
      return "Risk assessment is one of my key capabilities. I can identify legal risks, liability exposures, mitigation strategies, and recommend protective measures. Please share the document or specific risk concerns you'd like me to analyze.";
    } else {
      return "I'm here to provide comprehensive legal document analysis and insights. I can help with contract review, compliance checking, risk assessment, legal research, and strategic recommendations. Please share your document or specific legal question.";
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    AI Legal Assistant
                  </h1>
                  <p className="text-gray-600">Powered by advanced AI for comprehensive legal analysis</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Sparkles className="h-4 w-4" />
                <span>Enhanced Intelligence</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-6 mb-6 space-y-6">
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
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about legal documents, contracts, compliance..."
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
            />
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
