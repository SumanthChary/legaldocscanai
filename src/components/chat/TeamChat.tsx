import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Users, Plus, Hash, Send, Paperclip, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct';
  description?: string;
  organization_id: string;
  created_by: string;
  created_at: string;
}

interface Message {
  id: string;
  content?: string;
  message_type: 'text' | 'file' | 'analysis_share' | 'system';
  sender_id: string;
  created_at: string;
  file_url?: string;
  file_name?: string;
  analysis_id?: string;
  sender_profile: {
    username: string;
    avatar_url?: string;
  };
}

interface TeamMember {
  id: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url?: string;
    email: string;
  };
}

const TeamChat: React.FC = () => {
  const { toast } = useToast();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'public' | 'private'>('public');
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('');
  const [analyses, setAnalyses] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setCurrentUser({ ...user, profile });
    }
  };

  const loadChannels = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!userProfile?.organization_id) return;

    const { data, error } = await supabase
      .from('channels')
      .select(`
        id,
        name,
        type,
        description,
        organization_id,
        created_by,
        created_at,
        channel_members!inner(user_id)
      `)
      .eq('organization_id', userProfile.organization_id)
      .eq('channel_members.user_id', user.id);

    if (error) {
      console.error('Error loading channels:', error);
      return;
    }

    const typedChannels = (data || []).map(channel => ({
      ...channel,
      type: channel.type as 'public' | 'private' | 'direct'
    })) as Channel[];

    setChannels(typedChannels);
    if (typedChannels.length && !selectedChannel) {
      setSelectedChannel(typedChannels[0]);
    }
  };

  const loadTeamMembers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!userProfile?.organization_id) return;

    // Get team members first
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select('id, user_id')
      .eq('organization_id', userProfile.organization_id)
      .eq('status', 'active');

    if (membersError || !members) return;

    // Then get profiles for each member
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, email')
      .in('id', members.map(m => m.user_id));

    if (profilesError || !profiles) return;

    // Combine the data
    const teamMembersWithProfiles = members.map(member => {
      const profile = profiles.find(p => p.id === member.user_id);
      return {
        ...member,
        profiles: profile || { username: 'Unknown', email: '', avatar_url: null }
      };
    }).filter(member => member.profiles.username !== 'Unknown') as TeamMember[];

    setTeamMembers(teamMembersWithProfiles);
  };

  const loadAnalyses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('document_analyses')
      .select('*')
      .eq('user_id', user.id)
      .eq('analysis_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setAnalyses(data);
    }
  };

  const loadMessages = async () => {
    if (!selectedChannel) return;

    // Get messages first
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('channel_id', selectedChannel.id)
      .order('created_at', { ascending: true })
      .limit(50);

    if (messagesError || !messages) return;

    // Get sender profiles
    const senderIds = [...new Set(messages.map(m => m.sender_id))];
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', senderIds);

    if (profilesError || !profiles) return;

    // Combine the data
    const messagesWithProfiles = messages.map(message => {
      const senderProfile = profiles.find(p => p.id === message.sender_id);
      return {
        ...message,
        message_type: message.message_type as 'text' | 'file' | 'analysis_share' | 'system',
        sender_profile: senderProfile || { username: 'Unknown', avatar_url: null }
      };
    }) as Message[];

    setMessages(messagesWithProfiles);
  };

  const subscribeToMessages = () => {
    if (!selectedChannel) return;

    const channel = supabase
      .channel(`messages:${selectedChannel.id}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `channel_id=eq.${selectedChannel.id}`
        }, 
        async (payload) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          const newMessage = {
            ...payload.new,
            sender_profile: senderProfile
          } as Message;
          
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || !currentUser) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        channel_id: selectedChannel.id,
        sender_id: currentUser.id,
        content: newMessage,
        message_type: 'text'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return;
    }

    setNewMessage('');
  };

  const shareAnalysis = async () => {
    if (!selectedAnalysis || !selectedChannel || !currentUser) return;

    const analysis = analyses.find(a => a.id === selectedAnalysis);
    if (!analysis) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        channel_id: selectedChannel.id,
        sender_id: currentUser.id,
        content: `Shared analysis: ${analysis.original_name}`,
        message_type: 'analysis_share',
        analysis_id: selectedAnalysis
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to share analysis",
        variant: "destructive"
      });
      return;
    }

    setSelectedAnalysis('');
    toast({
      title: "Success",
      description: "Analysis shared successfully"
    });
  };

  const createChannel = async () => {
    if (!newChannelName.trim() || !currentUser?.profile?.organization_id) return;

    const { data, error } = await supabase
      .from('channels')
      .insert({
        name: newChannelName,
        type: newChannelType,
        organization_id: currentUser.profile.organization_id,
        created_by: currentUser.id
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create channel",
        variant: "destructive"
      });
      return;
    }

    // Add creator as channel member
    await supabase
      .from('channel_members')
      .insert({
        channel_id: data.id,
        user_id: currentUser.id,
        role: 'admin'
      });

    setNewChannelName('');
    setIsCreateChannelOpen(false);
    loadChannels();
    
    toast({
      title: "Success",
      description: "Channel created successfully"
    });
  };

  const createDirectMessage = async (memberId: string) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .rpc('create_direct_channel', { other_user_id: memberId });

      if (error) throw error;

      loadChannels();
      toast({
        title: "Success",
        description: "Direct message channel created"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create direct message",
        variant: "destructive"
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Team Chat</h3>
            <Dialog open={isCreateChannelOpen} onOpenChange={setIsCreateChannelOpen}>
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
                    onChange={(e) => setNewChannelName(e.target.value)}
                  />
                  <Select value={newChannelType} onValueChange={(value: 'public' | 'private') => setNewChannelType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={createChannel} className="w-full">
                    Create Channel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="h-40">
            <div className="space-y-1">
              {channels.filter(c => c.type !== 'direct').map((channel) => (
                <Button
                  key={channel.id}
                  variant={selectedChannel?.id === channel.id ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedChannel(channel)}
                >
                  <Hash className="h-4 w-4 mr-2" />
                  {channel.name}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <Separator className="my-4" />

          <h4 className="text-sm font-medium mb-2">Direct Messages</h4>
          <ScrollArea className="h-32">
            <div className="space-y-1">
              {channels.filter(c => c.type === 'direct').map((channel) => (
                <Button
                  key={channel.id}
                  variant={selectedChannel?.id === channel.id ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedChannel(channel)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Direct Message
                </Button>
              ))}
            </div>
          </ScrollArea>

          <Separator className="my-4" />

          <h4 className="text-sm font-medium mb-2">Team Members</h4>
          <ScrollArea className="h-32">
            <div className="space-y-1">
              {teamMembers.filter(m => m.user_id !== currentUser.id).map((member) => (
                <Button
                  key={member.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => createDirectMessage(member.user_id)}
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
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
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

            {/* Input Area */}
            <div className="p-4 border-t space-y-2">
              {/* Analysis Sharing */}
              {analyses.length > 0 && (
                <div className="flex space-x-2">
                  <Select value={selectedAnalysis} onValueChange={setSelectedAnalysis}>
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
                    onClick={shareAnalysis} 
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
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Select a channel to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamChat;