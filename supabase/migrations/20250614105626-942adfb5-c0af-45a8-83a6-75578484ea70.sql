
-- Update your specific account to have unlimited document analysis
-- Replace 'your-email@example.com' with your actual email address
UPDATE public.profiles 
SET document_limit = 999999
WHERE email = 'your-email@example.com';

-- If you want to also reset your current document count
UPDATE public.profiles 
SET document_count = 0
WHERE email = 'your-email@example.com';
