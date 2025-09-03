import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Hash, MessageSquare } from 'lucide-react';
import { Channel, TeamMember } from '../types';
import { ChannelsList } from './ChannelsList';
import { TeamMembersList } from './TeamMembersList';

interface ChatSidebarProps {
  channels: Channel[];
  teamMembers: TeamMember[];
  selectedChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
  onCreateDirectMessage: (memberId: string) => void;
  onCreateChannel: () => void;
  isCreateChannelOpen: boolean;
  onCreateChannelOpenChange: (open: boolean) => void;
  newChannelName: string;
  onNewChannelNameChange: (name: string) => void;
  newChannelType: 'public' | 'private';
  onNewChannelTypeChange: (type: 'public' | 'private') => void;
  currentUserId?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  channels,
  teamMembers,
  selectedChannel,
  onChannelSelect,
  onCreateDirectMessage,
  onCreateChannel,
  isCreateChannelOpen,
  onCreateChannelOpenChange,
  newChannelName,
  onNewChannelNameChange,
  newChannelType,
  onNewChannelTypeChange,
  currentUserId,
}) => {
  const publicChannels = channels.filter(c => c.type !== 'direct');
  const directChannels = channels.filter(c => c.type === 'direct');

  return (
    <div className="w-64 border-r bg-muted/10">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Team Chat</h3>
          <Dialog open={isCreateChannelOpen} onOpenChange={onCreateChannelOpenChange}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Channel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Channel name"
                  value={newChannelName}
                  onChange={(e) => onNewChannelNameChange(e.target.value)}
                />
                <Select value={newChannelType} onValueChange={onNewChannelTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={onCreateChannel} className="w-full">
                  Create Channel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-40">
          <ChannelsList
            channels={publicChannels}
            selectedChannel={selectedChannel}
            onChannelSelect={onChannelSelect}
            icon={Hash}
          />
        </ScrollArea>

        <Separator className="my-4" />

        <h4 className="text-sm font-medium mb-2">Direct Messages</h4>
        <ScrollArea className="h-32">
          <ChannelsList
            channels={directChannels}
            selectedChannel={selectedChannel}
            onChannelSelect={onChannelSelect}
            icon={MessageSquare}
            showDirectMessageLabel={true}
          />
        </ScrollArea>

        <Separator className="my-4" />

        <h4 className="text-sm font-medium mb-2">Team Members</h4>
        <ScrollArea className="h-32">
          <TeamMembersList
            teamMembers={teamMembers}
            currentUserId={currentUserId}
            onCreateDirectMessage={onCreateDirectMessage}
          />
        </ScrollArea>
      </div>
    </div>
  );
};