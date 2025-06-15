
-- 1. Table for e-signature requests (one per document/request session)
CREATE TABLE public.signature_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  document_name TEXT NOT NULL,
  document_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Each signature field in the document
CREATE TABLE public.signature_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.signature_requests(id) ON DELETE CASCADE,
  field_type TEXT NOT NULL, -- e.g. 'signature', 'initials', 'date', 'text'
  assigned_signer_email TEXT NOT NULL,
  position JSONB NOT NULL, -- coordinates/size in PDF: {page: 1, x: 100, y: 200, width: 150, height: 40}
  required BOOLEAN NOT NULL DEFAULT true
);

-- 3. Each actual signature applied
CREATE TABLE public.signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES public.signature_fields(id) ON DELETE CASCADE,
  signer_email TEXT NOT NULL,
  signature_image TEXT NOT NULL, -- base64 PNG/JPEG
  signed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- 4. Track secure, tokenized signing sessions for sharing links
CREATE TABLE public.signing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID NOT NULL REFERENCES public.signature_fields(id) ON DELETE CASCADE,
  signer_email TEXT NOT NULL,
  session_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  signed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all signature tables
ALTER TABLE public.signature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signature_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signing_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for signature_requests (creator can SELECT/UPDATE/DELETE their own, anyone can INSERT)
CREATE POLICY "User can view own signature requests"
  ON public.signature_requests FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "User can update own signature requests"
  ON public.signature_requests FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can insert signature requests"
  ON public.signature_requests FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "User can delete own signature requests"
  ON public.signature_requests FOR DELETE
  USING (user_id = auth.uid());

-- Policies for signature_fields (only linked to own requests)
CREATE POLICY "User can manage fields for own requests"
  ON public.signature_fields FOR ALL
  USING (
    request_id IN (SELECT id FROM public.signature_requests WHERE user_id = auth.uid())
  );

CREATE POLICY "User can insert signature fields for own request"
  ON public.signature_fields FOR INSERT
  WITH CHECK (
    request_id IN (SELECT id FROM public.signature_requests WHERE user_id = auth.uid())
  );

CREATE POLICY "User can update signature fields for own request"
  ON public.signature_fields FOR UPDATE
  USING (
    request_id IN (SELECT id FROM public.signature_requests WHERE user_id = auth.uid())
  )
  WITH CHECK (
    request_id IN (SELECT id FROM public.signature_requests WHERE user_id = auth.uid())
  );

-- Policies for signatures (signer can insert/select their own, admin can select all)
CREATE POLICY "Signer can select own signatures"
  ON public.signatures FOR SELECT
  USING (signer_email = auth.email());

CREATE POLICY "Signer can insert own signatures"
  ON public.signatures FOR INSERT
  WITH CHECK (signer_email = auth.email());

-- Allow request owner to see all signatures for their request
CREATE POLICY "Request owner can see all signatures"
  ON public.signatures FOR SELECT
  USING (
    field_id IN (
      SELECT id FROM public.signature_fields WHERE request_id IN (
        SELECT id FROM public.signature_requests WHERE user_id = auth.uid()
      )
    )
  );

-- Policies for signing_sessions: allow inserting/selecting by assigned signer
CREATE POLICY "Signer can view their signing sessions"
  ON public.signing_sessions FOR SELECT
  USING (signer_email = auth.email());

CREATE POLICY "Signer can insert their signing sessions"
  ON public.signing_sessions FOR INSERT
  WITH CHECK (signer_email = auth.email());

CREATE POLICY "Signer can update their signing sessions"
  ON public.signing_sessions FOR UPDATE
  USING (signer_email = auth.email())
  WITH CHECK (signer_email = auth.email());

-- Maintain updated_at triggers
CREATE OR REPLACE FUNCTION public.update_signature_request_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_signature_req_updated_at
BEFORE UPDATE ON public.signature_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_signature_request_updated_at();

