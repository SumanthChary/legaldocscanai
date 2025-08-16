-- Phase 2: Extend database schema for Whop integration

-- Add Whop-specific columns to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN whop_user_id TEXT,
ADD COLUMN whop_subscription_id TEXT,
ADD COLUMN whop_plan_id TEXT,
ADD COLUMN source TEXT DEFAULT 'direct' CHECK (source IN ('direct', 'whop'));

-- Extend subscriptions table for Whop support
ALTER TABLE public.subscriptions 
ADD COLUMN whop_user_id TEXT,
ADD COLUMN whop_subscription_id TEXT,
ADD COLUMN whop_plan_id TEXT,
ADD COLUMN source TEXT DEFAULT 'direct' CHECK (source IN ('direct', 'whop'));

-- Create table for tracking Whop webhook events
CREATE TABLE public.whop_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  whop_user_id TEXT NOT NULL,
  whop_subscription_id TEXT,
  whop_plan_id TEXT,
  event_data JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on whop_webhooks table
ALTER TABLE public.whop_webhooks ENABLE ROW LEVEL SECURITY;

-- Create policy for whop_webhooks (admin access only)
CREATE POLICY "Service role can manage whop webhooks" 
ON public.whop_webhooks 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create table for Whop transaction tracking
CREATE TABLE public.whop_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  whop_user_id TEXT NOT NULL,
  whop_subscription_id TEXT NOT NULL,
  whop_plan_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'chargeback')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on whop_transactions table
ALTER TABLE public.whop_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for whop_transactions
CREATE POLICY "Users can view their own whop transactions" 
ON public.whop_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage whop transactions" 
ON public.whop_transactions 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create function to update whop_transactions updated_at
CREATE OR REPLACE FUNCTION public.update_whop_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for whop_transactions updated_at
CREATE TRIGGER update_whop_transactions_updated_at
BEFORE UPDATE ON public.whop_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_whop_transactions_updated_at();

-- Update existing handle_new_user function to support Whop users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, username, email, source)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'source', 'direct')
  );
  return new;
end;
$function$;

-- Create function to sync Whop subscription with local subscription
CREATE OR REPLACE FUNCTION public.sync_whop_subscription(
  p_user_id UUID,
  p_whop_user_id TEXT,
  p_whop_subscription_id TEXT,
  p_whop_plan_id TEXT,
  p_plan_type TEXT,
  p_status TEXT,
  p_current_period_start TIMESTAMP WITH TIME ZONE,
  p_current_period_end TIMESTAMP WITH TIME ZONE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Update or insert subscription
  INSERT INTO public.subscriptions (
    user_id,
    plan_type,
    status,
    current_period_start,
    current_period_end,
    whop_user_id,
    whop_subscription_id,
    whop_plan_id,
    source
  ) VALUES (
    p_user_id,
    p_plan_type,
    p_status,
    p_current_period_start,
    p_current_period_end,
    p_whop_user_id,
    p_whop_subscription_id,
    p_whop_plan_id,
    'whop'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    plan_type = EXCLUDED.plan_type,
    status = EXCLUDED.status,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    whop_user_id = EXCLUDED.whop_user_id,
    whop_subscription_id = EXCLUDED.whop_subscription_id,
    whop_plan_id = EXCLUDED.whop_plan_id,
    source = EXCLUDED.source,
    updated_at = now();
    
  -- Update profile with Whop information
  UPDATE public.profiles SET
    whop_user_id = p_whop_user_id,
    whop_subscription_id = p_whop_subscription_id,
    whop_plan_id = p_whop_plan_id,
    source = 'whop'
  WHERE id = p_user_id;
END;
$function$;