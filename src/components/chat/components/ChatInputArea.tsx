import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Share2, Paperclip } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChatInputAreaProps {
  newMessage: string;
  onNewMessageChange: (message: string) => void;
  onSendMessage: () => void;
  selectedAnalysis: string;
  onSelectedAnalysisChange: (analysisId: string) => void;
  onShareAnalysis: () => void;
  analyses: any[];
  currentUser: any;
  selectedChannelId: string | null;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  newMessage,
  onNewMessageChange,
  onSendMessage,
  selectedAnalysis,
  onSelectedAnalysisChange,
  onShareAnalysis,
  analyses,
  currentUser,
  selectedChannelId,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChannelId || !currentUser) return;

    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `chat-files/${selectedChannelId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Send file message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          channel_id: selectedChannelId,
          sender_id: currentUser.id,
          content: `Shared file: ${file.name}`,
          message_type: 'file',
          file_url: publicUrl,
          file_name: file.name,
        });

      if (messageError) throw messageError;

      toast({
        title: "File shared",
        description: "File has been shared successfully",
      });

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to share file: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 border-t space-y-2">
      {/* Analysis Sharing */}
      {analyses.length > 0 && (
        <div className="flex space-x-2">
          <Select value={selectedAnalysis} onValueChange={onSelectedAnalysisChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Share an analysis..." />
            </SelectTrigger>
            <SelectContent>
              {analyses.map((analysis) => (
                <SelectItem key={analysis.id} value={analysis.id}>
                  {analysis.original_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={onShareAnalysis} 
            disabled={!selectedAnalysis}
            variant="outline"
            size="sm"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Message Input */}
      <div className="flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => onNewMessageChange(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button onClick={onSendMessage} disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};