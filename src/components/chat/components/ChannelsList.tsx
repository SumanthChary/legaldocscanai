import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { Channel } from '../types';

interface ChannelsListProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
  icon: LucideIcon;
  showDirectMessageLabel?: boolean;
}

export const ChannelsList: React.FC<ChannelsListProps> = ({
  channels,
  selectedChannel,
  onChannelSelect,
  icon: Icon,
  showDirectMessageLabel = false,
}) => {
  return (
    <div className="space-y-1">
      {channels.map((channel) => (
        <Button
          key={channel.id}
          variant={selectedChannel?.id === channel.id ? "secondary" : "ghost"}
          size="sm"
          className="w-full justify-start"
          onClick={() => onChannelSelect(channel)}
        >
          <Icon className="h-4 w-4 mr-2" />
          {showDirectMessageLabel ? 'Direct Message' : channel.name}
        </Button>
      ))}
    </div>
  );
};