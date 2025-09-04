import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Channel, Message, TeamMember } from '../types';

export const useTeamChat = () => {
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

    if (!userProfile?.organization_id) {
      console.log('User not part of any organization');
      return;
    }

    // First get all channels in the user's organization
    const { data: orgChannels, error: channelsError } = await supabase
      .from('channels')
      .select('*')
      .eq('organization_id', userProfile.organization_id);

    if (channelsError) {
      console.error('Error loading channels:', channelsError);
      return;
    }

    if (!orgChannels || orgChannels.length === 0) {
      console.log('No channels found in organization');
      setChannels([]);
      return;
    }

    // Get channel memberships for the user
    const { data: memberships, error: membershipError } = await supabase
      .from('channel_members')
      .select('channel_id')
      .eq('user_id', user.id);

    if (membershipError) {
      console.error('Error loading channel memberships:', membershipError);
      return;
    }

    const memberChannelIds = new Set(memberships?.map(m => m.channel_id) || []);

    // Filter channels to only those the user is a member of
    const userChannels = orgChannels.filter(channel => 
      memberChannelIds.has(channel.id)
    );

    const typedChannels = userChannels.map(channel => ({
      ...channel,
      type: channel.type as 'public' | 'private' | 'direct'
    })) as Channel[];

    console.log('Loaded channels:', typedChannels);
    setChannels(typedChannels);
    
    if (typedChannels.length > 0 && !selectedChannel) {
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

  return {
    // State
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
    
    // Actions
    setSelectedChannel,
    setNewMessage,
    setIsCreateChannelOpen,
    setNewChannelName,
    setNewChannelType,
    setSelectedAnalysis,
    
    // Functions
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
  };
};