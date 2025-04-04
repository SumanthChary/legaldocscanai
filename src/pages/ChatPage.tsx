
import { useState, useRef, useEffect } from "react";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, X } from "lucide-react";
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
      content: "Hello! I'm your legal assistant. How can I help you today?",
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

    // Add user message
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

    // Handle file upload if present
    if (file) {
      try {
        // In a real implementation, you would upload the file to your server/storage
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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: file 
          ? `I've analyzed the document "${file?.name}". This appears to be a legal document. Would you like me to summarize it or answer questions about specific sections?` 
          : generateResponse(input),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
      setFile(null);
    }, 500); // Reduced from 1500ms to 500ms for faster response
  };

  const generateResponse = (userInput: string): string => {
    // In a real implementation, this would call your AI service
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hello! How can I assist with your legal documents today?";
    } else if (lowerInput.includes("summarize") || lowerInput.includes("summary")) {
      return "I can summarize legal documents for you. Please upload a document to get started.";
    } else if (lowerInput.includes("help") || lowerInput.includes("features")) {
      return "I can help analyze legal documents, answer questions about legal terms, and provide summaries. What would you like assistance with?";
    } else {
      return "I'm here to assist with legal document analysis and questions. Would you like to upload a document or ask a specific question?";
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
      <div className="container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-200px)]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Legal Assistant Chat</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 border rounded-lg bg-gray-50 mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-white border shadow-sm"
                }`}
              >
                {message.content}
                {message.fileName && (
                  <div className="text-xs mt-1 flex items-center">
                    <Paperclip className="h-3 w-3 mr-1" />
                    {message.fileName}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <div ref={messagesEndRef} />
        </div>
        
        {file && (
          <div className="px-4 py-2 bg-accent/20 rounded-md flex items-center justify-between mb-4">
            <div className="flex items-center text-sm">
              <Paperclip className="h-4 w-4 mr-2" />
              <span className="truncate max-w-[200px]">{file.name}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="flex gap-2">
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
            className="h-12"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="h-12"
          />
          <Button size="default" onClick={handleSend} disabled={isLoading} className="h-12 px-6">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ChatPage;
