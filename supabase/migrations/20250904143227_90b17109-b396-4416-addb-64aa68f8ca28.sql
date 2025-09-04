-- Create trigger to update profile organization when user joins team
CREATE TRIGGER update_profile_org_on_team_join
AFTER INSERT OR UPDATE ON team_members
FOR EACH ROW
WHEN (NEW.status = 'active')
EXECUTE FUNCTION update_profile_organization();

-- Also create a trigger for channel creators to auto-join as members
CREATE OR REPLACE FUNCTION auto_add_channel_creator()
RETURNS TRIGGER AS $$
BEGIN
  -- Add channel creator as admin member
  INSERT INTO channel_members (channel_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'admin');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER auto_add_channel_creator_trigger
AFTER INSERT ON channels
FOR EACH ROW
EXECUTE FUNCTION auto_add_channel_creator();