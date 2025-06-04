
import { useState, useRef } from "react";
import { PageLayout } from "@/components/layout";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { ModernChatInput } from "@/components/chat/ModernChatInput";

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
  const { toast } = useToast();

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

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
        <div className="flex flex-col h-screen">
          <div className="flex-shrink-0 px-4 md:px-6 lg:px-8 pt-6 md:pt-8">
            <div className="max-w-4xl mx-auto">
              <ChatHeader />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col min-h-0 px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
              <MessageList messages={messages} isLoading={isLoading} />
            </div>
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
    </PageLayout>
  );
};

export default ChatPage;
