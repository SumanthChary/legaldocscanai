-- Create storage policy for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for avatar uploads in documents bucket
CREATE POLICY "Users can view their own avatars" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = 'avatars' AND auth.uid()::text = (storage.foldername(name))[2]);

CREATE POLICY "Users can upload their own avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = 'avatars' AND auth.uid()::text = (storage.foldername(name))[2]);

CREATE POLICY "Users can update their own avatars" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = 'avatars' AND auth.uid()::text = (storage.foldername(name))[2]);

CREATE POLICY "Users can delete their own avatars" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = 'avatars' AND auth.uid()::text = (storage.foldername(name))[2]);

-- Update profiles table with proper limits for free tier users (default is 3, not 50)
UPDATE profiles 
SET document_limit = 3 
WHERE document_limit IS NULL OR document_limit = 50;

-- Update the trigger to properly set document limits based on subscription
DROP TRIGGER IF EXISTS update_document_limit_trigger ON subscriptions;

CREATE OR REPLACE FUNCTION public.update_document_limit_on_subscription()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE profiles SET document_limit = 
    CASE 
      WHEN NEW.plan_type = 'professional' THEN 500
      WHEN NEW.plan_type = 'enterprise' THEN 999999
      WHEN NEW.plan_type = 'pay_per_document' THEN 1
      ELSE 3  -- Free tier (default)
    END
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER update_document_limit_trigger
AFTER INSERT OR UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_document_limit_on_subscription();