import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatMessageArea } from './components/ChatMessageArea';
import { ChatInputArea } from './components/ChatInputArea';
import { useTeamChat } from './hooks/useTeamChat';

const TeamChat: React.FC = () => {
  const {
    channels,
    selectedChannel,
    messages,
    newMessage,
    teamMembers,
    currentUser,
    isCreateChannelOpen,
    newChannelName,
    newChannelType,
    selectedAnalysis,
    analyses,
    messagesEndRef,
    setSelectedChannel,
    setNewMessage,
    setIsCreateChannelOpen,
    setNewChannelName,
    setNewChannelType,
    setSelectedAnalysis,
    loadCurrentUser,
    loadChannels,
    loadTeamMembers,
    loadAnalyses,
    loadMessages,
    subscribeToMessages,
    sendMessage,
    shareAnalysis,
    createChannel,
    createDirectMessage,
    scrollToBottom,
  } = useTeamChat();

  useEffect(() => {
    console.log('Team Chat mounted, loading initial data...');
    loadCurrentUser();
    loadChannels();
    loadTeamMembers();
    loadAnalyses();
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      loadMessages();
      subscribeToMessages();
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!currentUser?.profile?.organization_id) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Join or create an organization to use team chat</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex h-[600px] bg-background border rounded-lg">
      <ChatSidebar
        channels={channels}
        teamMembers={teamMembers}
        selectedChannel={selectedChannel}
        onChannelSelect={setSelectedChannel}
        onCreateDirectMessage={createDirectMessage}
        onCreateChannel={createChannel}
        isCreateChannelOpen={isCreateChannelOpen}
        onCreateChannelOpenChange={setIsCreateChannelOpen}
        newChannelName={newChannelName}
        onNewChannelNameChange={setNewChannelName}
        newChannelType={newChannelType}
        onNewChannelTypeChange={setNewChannelType}
        currentUserId={currentUser?.id}
      />

      <div className="flex-1 flex flex-col">
        <ChatMessageArea
          selectedChannel={selectedChannel}
          messages={messages}
          messagesEndRef={messagesEndRef}
        />
        
        {selectedChannel && (
          <ChatInputArea
            newMessage={newMessage}
            onNewMessageChange={setNewMessage}
            onSendMessage={sendMessage}
            selectedAnalysis={selectedAnalysis}
            onSelectedAnalysisChange={setSelectedAnalysis}
            onShareAnalysis={shareAnalysis}
            analyses={analyses}
            currentUser={currentUser}
            selectedChannelId={selectedChannel.id}
          />
        )}
      </div>
    </div>
  );
};

export default TeamChat;