-- Create chat-related tables for team collaboration

-- Channels table for different chat rooms/groups
CREATE TABLE public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('public', 'private', 'direct')) DEFAULT 'public',
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Channel members table
CREATE TABLE public.channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  message_type TEXT CHECK (message_type IN ('text', 'file', 'analysis_share', 'system')) DEFAULT 'text',
  file_url TEXT,
  file_name TEXT,
  analysis_id UUID REFERENCES public.document_analyses(id) ON DELETE SET NULL,
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message reactions table
CREATE TABLE public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reaction TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, reaction)
);

-- Enable RLS on all tables
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for channels
CREATE POLICY "Users can view channels in their organization"
ON public.channels FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.organization_id = channels.organization_id
  )
);

CREATE POLICY "Organization admins can create channels"
ON public.channels FOR INSERT
TO authenticated
WITH CHECK (
  public.is_organization_admin(auth.uid(), organization_id)
);

CREATE POLICY "Channel creators and org admins can update channels"
ON public.channels FOR UPDATE
TO authenticated
USING (
  created_by = auth.uid() OR 
  public.is_organization_admin(auth.uid(), organization_id)
);

-- RLS Policies for channel_members
CREATE POLICY "Users can view members of channels they belong to"
ON public.channel_members FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.channel_members cm
    WHERE cm.channel_id = channel_members.channel_id AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Channel admins can manage members"
ON public.channel_members FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.channels c
    LEFT JOIN public.channel_members cm ON c.id = cm.channel_id
    WHERE c.id = channel_members.channel_id 
    AND (c.created_by = auth.uid() OR cm.user_id = auth.uid() AND cm.role = 'admin')
  )
);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in channels they belong to"
ON public.messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.channel_members cm
    WHERE cm.channel_id = messages.channel_id AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Channel members can send messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.channel_members cm
    WHERE cm.channel_id = messages.channel_id AND cm.user_id = auth.uid()
  ) AND sender_id = auth.uid()
);

CREATE POLICY "Users can update their own messages"
ON public.messages FOR UPDATE
TO authenticated
USING (sender_id = auth.uid());

-- RLS Policies for message_reactions
CREATE POLICY "Users can view reactions on messages they can see"
ON public.message_reactions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.messages m
    JOIN public.channel_members cm ON m.channel_id = cm.channel_id
    WHERE m.id = message_reactions.message_id AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage their own reactions"
ON public.message_reactions FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create functions for chat functionality
CREATE OR REPLACE FUNCTION public.create_direct_channel(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_org_id UUID;
  other_user_org_id UUID;
  existing_channel_id UUID;
  new_channel_id UUID;
BEGIN
  -- Get organization IDs
  SELECT organization_id INTO current_user_org_id FROM profiles WHERE id = auth.uid();
  SELECT organization_id INTO other_user_org_id FROM profiles WHERE id = other_user_id;
  
  -- Check if users are in the same organization
  IF current_user_org_id != other_user_org_id OR current_user_org_id IS NULL THEN
    RAISE EXCEPTION 'Users must be in the same organization';
  END IF;
  
  -- Check if direct channel already exists
  SELECT c.id INTO existing_channel_id
  FROM channels c
  JOIN channel_members cm1 ON c.id = cm1.channel_id AND cm1.user_id = auth.uid()
  JOIN channel_members cm2 ON c.id = cm2.channel_id AND cm2.user_id = other_user_id
  WHERE c.type = 'direct'
  GROUP BY c.id
  HAVING COUNT(cm1.user_id) = 2;
  
  IF existing_channel_id IS NOT NULL THEN
    RETURN existing_channel_id;
  END IF;
  
  -- Create new direct channel
  INSERT INTO channels (organization_id, name, type, created_by)
  VALUES (current_user_org_id, 'Direct Message', 'direct', auth.uid())
  RETURNING id INTO new_channel_id;
  
  -- Add both users as members
  INSERT INTO channel_members (channel_id, user_id, role)
  VALUES 
    (new_channel_id, auth.uid(), 'admin'),
    (new_channel_id, other_user_id, 'admin');
  
  RETURN new_channel_id;
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_channels_organization_id ON public.channels(organization_id);
CREATE INDEX idx_channel_members_channel_id ON public.channel_members(channel_id);
CREATE INDEX idx_channel_members_user_id ON public.channel_members(user_id);
CREATE INDEX idx_messages_channel_id ON public.messages(channel_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_message_reactions_message_id ON public.message_reactions(message_id);

-- Add triggers for updated_at
CREATE TRIGGER update_channels_updated_at
  BEFORE UPDATE ON public.channels
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for chat tables
ALTER TABLE public.channels REPLICA IDENTITY FULL;
ALTER TABLE public.channel_members REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.channels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.channel_members;  
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;