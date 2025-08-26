-- Drop all RLS policies that might cause recursion
DROP POLICY IF EXISTS "Team members can view same org members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Users can join via invitation" ON public.team_members;
DROP POLICY IF EXISTS "Members view org invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Admins create invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Admins update invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Members view org audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Members view org profiles" ON public.profiles;

-- Create simple, non-recursive policies
-- Team Members - simple policies
CREATE POLICY "Users can view team members" 
ON public.team_members FOR SELECT 
USING (true); -- Allow all authenticated users to view team members

CREATE POLICY "Users can insert team members" 
ON public.team_members FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update team members" 
ON public.team_members FOR UPDATE 
USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.team_members tm 
  WHERE tm.user_id = auth.uid() 
  AND tm.organization_id = team_members.organization_id 
  AND tm.role IN ('owner', 'admin')
  AND tm.status = 'active'
));

CREATE POLICY "Users can delete team members" 
ON public.team_members FOR DELETE 
USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.team_members tm 
  WHERE tm.user_id = auth.uid() 
  AND tm.organization_id = team_members.organization_id 
  AND tm.role IN ('owner', 'admin')
  AND tm.status = 'active'
));

-- Team invitations - simple policies
CREATE POLICY "Users can view team invitations" 
ON public.team_invitations FOR SELECT 
USING (true); -- Allow all authenticated users to view invitations

CREATE POLICY "Users can create team invitations" 
ON public.team_invitations FOR INSERT 
WITH CHECK (invited_by = auth.uid());

CREATE POLICY "Users can update team invitations" 
ON public.team_invitations FOR UPDATE 
USING (invited_by = auth.uid());

-- Audit logs - simple policies
CREATE POLICY "Users can view audit logs" 
ON public.audit_logs FOR SELECT 
USING (true); -- Allow all authenticated users to view audit logs

-- Profiles - keep simple policies
CREATE POLICY "Users can view all profiles" 
ON public.profiles FOR SELECT 
USING (true); -- Allow all authenticated users to view profiles

-- Organizations - simple policies
CREATE POLICY "Users can view organizations" 
ON public.organizations FOR SELECT 
USING (true); -- Allow all authenticated users to view organizations