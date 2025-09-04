-- Fix missing data and create proper associations

-- First, update profiles to have organization_id for team members
UPDATE profiles 
SET organization_id = tm.organization_id 
FROM team_members tm 
WHERE profiles.id = tm.user_id 
AND tm.status = 'active'
AND profiles.organization_id IS NULL;

-- Insert missing channel memberships for channel creators
INSERT INTO channel_members (channel_id, user_id, role)
SELECT c.id, c.created_by, 'admin'
FROM channels c
LEFT JOIN channel_members cm ON c.id = cm.channel_id AND c.created_by = cm.user_id
WHERE cm.id IS NULL;

-- Create a function to automatically add organization_id to profile when joining team
CREATE OR REPLACE FUNCTION update_profile_organization()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile with organization_id when user joins a team
  UPDATE profiles 
  SET organization_id = NEW.organization_id
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;