
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Send, Loader2 } from "lucide-react";

type SigningLinkGeneratorProps = {
  requestId: string;
  signerEmail: string;
  onLinkGenerated: (link: string) => void;
};

export function SigningLinkGenerator({ requestId, signerEmail, onLinkGenerated }: SigningLinkGeneratorProps) {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [link, setLink] = useState<string | null>(null);

  const generateSigningLink = async () => {
    setGenerating(true);
    try {
      // Get the signature field for this request
      const { data: field, error: fieldError } = await supabase
        .from("signature_fields")
        .select("id")
        .eq("request_id", requestId)
        .eq("assigned_signer_email", signerEmail)
        .single();

      if (fieldError || !field) {
        throw new Error("Signature field not found");
      }

      // Generate session token
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

      // Create signing session
      const { error: sessionError } = await supabase
        .from("signing_sessions")
        .insert({
          field_id: field.id,
          signer_email: signerEmail,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
        });

      if (sessionError) {
        throw sessionError;
      }

      const signingLink = `${window.location.origin}/sign/${sessionToken}`;
      setLink(signingLink);
      onLinkGenerated(signingLink);

      toast({
        title: "Signing link generated!",
        description: "You can now copy and share this link with the signer.",
      });
    } catch (error: any) {
      console.error("Error generating signing link:", error);
      toast({
        title: "Failed to generate link",
        description: error.message || "An error occurred while generating the signing link.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copied!",
        description: "The signing link has been copied to your clipboard.",
      });
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast({
        title: "Failed to copy link",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const sendEmailNotification = async () => {
    if (!link) return;

    setSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-signature-email", {
        body: {
          signerEmail,
          signingLink: link,
          documentName: "Document", // You might want to pass this as a prop
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email sent!",
        description: `Signing invitation sent to ${signerEmail}`,
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Failed to send email",
        description: error.message || "An error occurred while sending the email.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Signing Link</h3>
        <span className="text-sm text-gray-500">{signerEmail}</span>
      </div>

      {!link ? (
        <Button
          onClick={generateSigningLink}
          disabled={generating}
          className="w-full"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Generating...
            </>
          ) : (
            "Generate Signing Link"
          )}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={link}
              readOnly
              className="flex-1 text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={sendEmailNotification}
            disabled={sending}
            variant="outline"
            className="w-full"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email Invitation
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}
