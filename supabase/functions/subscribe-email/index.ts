import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    const emailResponse = await resend.emails.send({
      from: "LegalAI <onboarding@resend.dev>",
      to: ["sumanthchary.business@gmail.com"],
      subject: "New Newsletter Subscription",
      html: `
        <h1>New Newsletter Subscription</h1>
        <p>A new user has subscribed to the newsletter:</p>
        <p>Email: ${email}</p>
      `,
    });

    // Send confirmation to subscriber
    await resend.emails.send({
      from: "LegalAI <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to LegalAI Newsletter!",
      html: `
        <h1>Thank you for subscribing!</h1>
        <p>You've successfully subscribed to LegalAI's newsletter. We'll keep you updated with our latest features and updates.</p>
        <p>Best regards,<br>The LegalAI Team</p>
      `,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in subscribe-email function:", error);
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