-- Fix the team invitation duplicate email issue
-- Allow handling duplicate invitations more gracefully

-- First, let's update existing constraint to handle resending invitations
-- Drop the existing unique constraint if it exists
ALTER TABLE team_invitations DROP CONSTRAINT IF EXISTS team_invitations_organization_id_email_key;

-- Create a partial unique constraint that only applies to pending invitations
-- This allows multiple invitations to the same email if previous ones were cancelled/expired
CREATE UNIQUE INDEX team_invitations_org_email_pending_idx 
ON team_invitations (organization_id, email) 
WHERE status = 'pending';

-- Add a function to handle invitation conflicts
CREATE OR REPLACE FUNCTION public.upsert_team_invitation(
  p_organization_id UUID,
  p_email TEXT,
  p_role TEXT,
  p_invited_by UUID,
  p_token TEXT,
  p_expires_at TIMESTAMP WITH TIME ZONE
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  existing_invitation_id UUID;
  new_invitation_id UUID;
BEGIN
  -- Check for existing pending invitation
  SELECT id INTO existing_invitation_id
  FROM team_invitations
  WHERE organization_id = p_organization_id 
    AND email = p_email 
    AND status = 'pending'
    AND expires_at > NOW();

  IF existing_invitation_id IS NOT NULL THEN
    -- Update existing invitation with new token and expiry
    UPDATE team_invitations
    SET 
      token = p_token,
      expires_at = p_expires_at,
      invited_by = p_invited_by,
      role = p_role,
      created_at = NOW()
    WHERE id = existing_invitation_id
    RETURNING id INTO new_invitation_id;
    
    RETURN new_invitation_id;
  ELSE
    -- Cancel any old invitations for this email/org combo
    UPDATE team_invitations
    SET status = 'cancelled'
    WHERE organization_id = p_organization_id 
      AND email = p_email 
      AND status = 'pending';
    
    -- Create new invitation
    INSERT INTO team_invitations (
      organization_id, email, role, invited_by, token, expires_at
    ) VALUES (
      p_organization_id, p_email, p_role, p_invited_by, p_token, p_expires_at
    ) RETURNING id INTO new_invitation_id;
    
    RETURN new_invitation_id;
  END IF;
END;
$$;