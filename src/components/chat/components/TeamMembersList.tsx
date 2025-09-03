import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember } from '../types';

interface TeamMembersListProps {
  teamMembers: TeamMember[];
  currentUserId?: string;
  onCreateDirectMessage: (memberId: string) => void;
}

export const TeamMembersList: React.FC<TeamMembersListProps> = ({
  teamMembers,
  currentUserId,
  onCreateDirectMessage,
}) => {
  return (
    <div className="space-y-1">
      {teamMembers.filter(m => m.user_id !== currentUserId).map((member) => (
        <Button
          key={member.id}
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => onCreateDirectMessage(member.user_id)}
        >
          <Avatar className="h-4 w-4 mr-2">
            <AvatarImage src={member.profiles?.avatar_url} />
            <AvatarFallback>
              {member.profiles?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {member.profiles?.username}
        </Button>
      ))}
    </div>
  );
};