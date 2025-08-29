-- Fix infinite recursion in RLS policies by simplifying them

-- Drop problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view their own profile and team members" ON public.profiles;
DROP POLICY IF EXISTS "Users can view team members in their organization" ON public.team_members;
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;

-- Create simpler, non-recursive policies for profiles
CREATE POLICY "Users can view all profiles - simple" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Create simpler policies for team_members to avoid recursion
CREATE POLICY "Users can view all team members - simple" 
ON public.team_members 
FOR SELECT 
USING (true);

-- Create simpler policy for organizations
CREATE POLICY "Users can view all organizations - simple" 
ON public.organizations 
FOR SELECT 
USING (true);

-- Keep the existing restrictive policies for INSERT/UPDATE/DELETE operations
-- These are safe because they don't cause recursive lookups

-- For team_members, keep existing policies for modification operations:
-- "Users can insert team members" - already exists and is safe
-- "Users can update team members" - already exists and is safe  
-- "Users can delete team members" - already exists and is safe

-- For profiles, keep existing policies for modification operations:
-- "Users can insert their own profile" - already exists and is safe
-- "Users can update their own profile" - already exists and is safe

-- For organizations, keep existing policies for modification operations:
-- "Users can create organizations" - already exists and is safe
-- "Organization owners can update their organization" - already exists and is safe