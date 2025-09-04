-- Fix the security warning by setting search_path for auto_add_channel_creator function
CREATE OR REPLACE FUNCTION public.auto_add_channel_creator()
RETURNS TRIGGER AS $$
BEGIN
  -- Add channel creator as admin member
  INSERT INTO channel_members (channel_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'admin');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;