-- Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  owner_id UUID NOT NULL,
  subscription_tier TEXT DEFAULT 'free',
  max_members INTEGER DEFAULT 5,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Create team members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  invited_by UUID,
  status TEXT NOT NULL DEFAULT 'active',
  permissions JSONB DEFAULT '{}'::jsonb,
  UNIQUE(organization_id, user_id)
);

-- Create team invitations table
CREATE TABLE public.team_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  invited_by UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(organization_id, email)
);

-- Create audit logs table for security
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add organization_id to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN organization_id UUID,
ADD COLUMN role TEXT DEFAULT 'member',
ADD COLUMN last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN login_history JSONB DEFAULT '[]'::jsonb,
ADD COLUMN security_settings JSONB DEFAULT '{}'::jsonb;

-- Add organization_id to document_analyses table
ALTER TABLE public.document_analyses 
ADD COLUMN organization_id UUID;

-- Enable RLS on new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view organizations they belong to" 
ON public.organizations FOR SELECT 
USING (
  id IN (
    SELECT organization_id FROM public.team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Organization owners can update their organization" 
ON public.organizations FOR UPDATE 
USING (owner_id = auth.uid());

CREATE POLICY "Users can create organizations" 
ON public.organizations FOR INSERT 
WITH CHECK (owner_id = auth.uid());

-- Team members policies
CREATE POLICY "Users can view team members in their organization" 
ON public.team_members FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id FROM public.team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Organization admins can manage team members" 
ON public.team_members FOR ALL 
USING (
  organization_id IN (
    SELECT organization_id FROM public.team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
  )
);

CREATE POLICY "Users can insert themselves into teams via invitation" 
ON public.team_members FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Team invitations policies
CREATE POLICY "Users can view invitations for their organization" 
ON public.team_invitations FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id FROM public.team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
  )
);

CREATE POLICY "Organization admins can create invitations" 
ON public.team_invitations FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM public.team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
  )
  AND invited_by = auth.uid()
);

CREATE POLICY "Organization admins can update invitations" 
ON public.team_invitations FOR UPDATE 
USING (
  organization_id IN (
    SELECT organization_id FROM public.team_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
  )
);

-- Audit logs policies
CREATE POLICY "Users can view audit logs for their organization" 
ON public.audit_logs FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_id FROM public.team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "System can insert audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Update existing profiles policies to work with organizations
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile and team members" 
ON public.profiles FOR SELECT 
USING (
  id = auth.uid() 
  OR (
    organization_id IS NOT NULL 
    AND organization_id IN (
      SELECT organization_id FROM public.team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  )
);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION public.create_organization_with_owner(
  org_name TEXT,
  org_description TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
  user_id UUID;
BEGIN
  user_id := auth.uid();
  
  -- Create organization
  INSERT INTO public.organizations (name, description, owner_id)
  VALUES (org_name, org_description, user_id)
  RETURNING id INTO new_org_id;
  
  -- Add owner as team member
  INSERT INTO public.team_members (organization_id, user_id, role, status)
  VALUES (new_org_id, user_id, 'owner', 'active');
  
  -- Update user profile
  UPDATE public.profiles 
  SET organization_id = new_org_id, role = 'owner'
  WHERE id = user_id;
  
  -- Log the action
  INSERT INTO public.audit_logs (organization_id, user_id, action, details)
  VALUES (new_org_id, user_id, 'organization_created', jsonb_build_object('organization_name', org_name));
  
  RETURN new_org_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_user_action(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'::jsonb
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_org_id UUID;
BEGIN
  -- Get user's organization
  SELECT organization_id INTO user_org_id
  FROM public.profiles
  WHERE id = auth.uid();
  
  INSERT INTO public.audit_logs (
    organization_id, user_id, action, resource_type, 
    resource_id, details, ip_address
  ) VALUES (
    user_org_id, auth.uid(), p_action, p_resource_type,
    p_resource_id, p_details, inet_client_addr()
  );
END;
$$;

-- Create trigger to update organization updated_at
CREATE OR REPLACE FUNCTION public.update_organization_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_organization_updated_at();