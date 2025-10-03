import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ChatHistoryItem {
  id: string;
  message_text: string;
  response_text: string;
  created_at: string;
}

interface ChatHistorySidebarProps {
  onLoadChat: (messages: Array<{ id: string; content: string; sender: "user" | "ai"; timestamp: Date }>) => void;
  currentUserId: string | null;
}

export const ChatHistorySidebar = ({ onLoadChat, currentUserId }: ChatHistorySidebarProps) => {
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadHistory = async () => {
    if (!currentUserId) return;
    
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('chat_history')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory((data || []) as ChatHistoryItem[]);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [currentUserId]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const { error } = await (supabase as any)
        .from('chat_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Deleted",
        description: "Chat history item deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete chat history.",
      });
    }
  };

  const handleLoadChat = (item: ChatHistoryItem) => {
    const messages = [
      {
        id: `${item.id}-user`,
        content: item.message_text,
        sender: "user" as const,
        timestamp: new Date(item.created_at),
      },
      {
        id: `${item.id}-ai`,
        content: item.response_text,
        sender: "ai" as const,
        timestamp: new Date(item.created_at),
      },
    ];
    onLoadChat(messages);
    toast({
      title: "Chat loaded",
      description: "Previous conversation loaded successfully.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r bg-background/50">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Chat History
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {history.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No chat history yet</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => handleLoadChat(item)}
                className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.message_text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(item.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDelete(item.id, e)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
