
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignatureEmailRequest {
  signerEmail: string;
  signingLink: string;
  documentName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { signerEmail, signingLink, documentName }: SignatureEmailRequest = await req.json();

    // For now, we'll just log the email request
    console.log("Email notification request:", {
      to: signerEmail,
      subject: `Please sign: ${documentName}`,
      signingLink,
    });

    // In a real implementation, you would:
    // 1. Use a service like Resend, SendGrid, or similar
    // 2. Send an actual email with the signing link
    // 3. Include a professional email template

    // Mock response for now
    const emailResponse = {
      id: `mock_${Date.now()}`,
      message: "Email would be sent in production",
      recipient: signerEmail,
      status: "sent",
    };

    console.log("Mock email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-signature-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
