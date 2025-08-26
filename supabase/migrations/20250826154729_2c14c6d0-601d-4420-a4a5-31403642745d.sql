-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view team members in same organization" ON public.team_members;
DROP POLICY IF EXISTS "Organization admins can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Users can insert themselves into teams via invitation" ON public.team_members;
DROP POLICY IF EXISTS "Organization members can view invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Organization admins can create invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Organization admins can update invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Organization members can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Organization members can view other profiles" ON public.profiles;

-- Create security definer functions to avoid recursion (recreate to ensure they exist)
CREATE OR REPLACE FUNCTION public.get_user_organization_id(p_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION public.is_organization_admin(p_user_id UUID, p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members 
    WHERE user_id = p_user_id 
    AND organization_id = p_org_id 
    AND role IN ('owner', 'admin') 
    AND status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_organization_member(p_user_id UUID, p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members 
    WHERE user_id = p_user_id 
    AND organization_id = p_org_id 
    AND status = 'active'
  );
$$;

-- Simple, safe policies without recursion
-- Team Members policies
CREATE POLICY "Team members can view same org members" 
ON public.team_members FOR SELECT 
USING (public.is_organization_member(auth.uid(), organization_id));

CREATE POLICY "Admins can manage team members" 
ON public.team_members FOR ALL 
USING (public.is_organization_admin(auth.uid(), organization_id));

CREATE POLICY "Users can join via invitation" 
ON public.team_members FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Team invitations policies
CREATE POLICY "Members view org invitations" 
ON public.team_invitations FOR SELECT 
USING (public.is_organization_member(auth.uid(), organization_id));

CREATE POLICY "Admins create invitations" 
ON public.team_invitations FOR INSERT 
WITH CHECK (
  public.is_organization_admin(auth.uid(), organization_id)
  AND invited_by = auth.uid()
);

CREATE POLICY "Admins update invitations" 
ON public.team_invitations FOR UPDATE 
USING (public.is_organization_admin(auth.uid(), organization_id));

-- Audit logs policies
CREATE POLICY "Members view org audit logs" 
ON public.audit_logs FOR SELECT 
USING (public.is_organization_member(auth.uid(), organization_id));

-- Profiles policies (separate to avoid recursion)
CREATE POLICY "Users view own profile" 
ON public.profiles FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Members view org profiles" 
ON public.profiles FOR SELECT 
USING (
  id != auth.uid() 
  AND organization_id IS NOT NULL 
  AND public.is_organization_member(auth.uid(), organization_id)
);