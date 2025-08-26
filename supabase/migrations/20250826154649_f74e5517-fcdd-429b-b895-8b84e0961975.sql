-- Drop problematic policies that cause recursion
DROP POLICY IF EXISTS "Users can view team members in their organization" ON public.team_members;
DROP POLICY IF EXISTS "Organization admins can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Users can view invitations for their organization" ON public.team_invitations;
DROP POLICY IF EXISTS "Organization admins can create invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Organization admins can update invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can view audit logs for their organization" ON public.audit_logs;

-- Create security definer functions to avoid recursion
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

-- Create new safe policies using security definer functions
CREATE POLICY "Users can view team members in same organization" 
ON public.team_members FOR SELECT 
USING (public.is_organization_member(auth.uid(), organization_id));

CREATE POLICY "Organization admins can manage team members" 
ON public.team_members FOR ALL 
USING (public.is_organization_admin(auth.uid(), organization_id));

CREATE POLICY "Users can insert themselves into teams via invitation" 
ON public.team_members FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Team invitations policies
CREATE POLICY "Organization members can view invitations" 
ON public.team_invitations FOR SELECT 
USING (public.is_organization_member(auth.uid(), organization_id));

CREATE POLICY "Organization admins can create invitations" 
ON public.team_invitations FOR INSERT 
WITH CHECK (
  public.is_organization_admin(auth.uid(), organization_id)
  AND invited_by = auth.uid()
);

CREATE POLICY "Organization admins can update invitations" 
ON public.team_invitations FOR UPDATE 
USING (public.is_organization_admin(auth.uid(), organization_id));

-- Audit logs policies
CREATE POLICY "Organization members can view audit logs" 
ON public.audit_logs FOR SELECT 
USING (public.is_organization_member(auth.uid(), organization_id));

-- Fix the profiles policy to avoid recursion
DROP POLICY IF EXISTS "Users can view their own profile and team members" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (id = auth.uid());

CREATE POLICY "Organization members can view other profiles" 
ON public.profiles FOR SELECT 
USING (
  id != auth.uid() 
  AND organization_id IS NOT NULL 
  AND public.is_organization_member(auth.uid(), organization_id)
);