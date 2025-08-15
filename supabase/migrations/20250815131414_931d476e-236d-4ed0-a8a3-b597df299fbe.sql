-- Fix the security issues by adding proper search_path settings to functions
ALTER FUNCTION public.get_public_profile(user_id uuid) SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.update_signature_request_updated_at() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.force_update_analysis(analysis_id uuid, new_summary text, new_status text) SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.update_document_count() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.check_expired_redemptions() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.update_document_limit_on_subscription() SECURITY DEFINER SET search_path = public;