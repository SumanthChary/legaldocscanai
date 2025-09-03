import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, MessageSquare, Share2, Paperclip } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Channel, Message } from '../types';

interface ChatMessageAreaProps {
  selectedChannel: Channel | null;
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessageArea: React.FC<ChatMessageAreaProps> = ({
  selectedChannel,
  messages,
  messagesEndRef,
}) => {
  if (!selectedChannel) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Select a channel to start chatting</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          {selectedChannel.type === 'direct' ? (
            <MessageSquare className="h-5 w-5" />
          ) : (
            <Hash className="h-5 w-5" />
          )}
          <h3 className="font-semibold">{selectedChannel.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {selectedChannel.type}
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.sender_profile?.avatar_url} />
                <AvatarFallback>
                  {message.sender_profile?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">
                    {message.sender_profile?.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </span>
                </div>
                <div className="mt-1">
                  {message.message_type === 'analysis_share' ? (
                    <Card className="p-3 bg-blue-50 border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Share2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          {message.content}
                        </span>
                      </div>
                    </Card>
                  ) : message.message_type === 'file' ? (
                    <div className="space-y-2">
                      {message.content && (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <Card className="p-3 bg-gray-50 border-gray-200">
                        <div className="flex items-center space-x-2">
                          <Paperclip className="h-4 w-4 text-gray-600" />
                          <a
                            href={message.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            {message.file_name}
                          </a>
                        </div>
                      </Card>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </>
  );
};