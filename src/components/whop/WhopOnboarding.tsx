import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WhopOnboardingProps {
  onComplete?: () => void;
}

export function WhopOnboarding({ onComplete }: WhopOnboardingProps) {
  const { toast } = useToast();
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedCallback, setCopiedCallback] = useState(false);

  const webhookUrl = `${window.location.origin}/api/whop/webhooks`;
  const callbackUrl = `${window.location.origin}/whop/callback`;

  const copyToClipboard = async (text: string, type: 'webhook' | 'callback') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'webhook') {
        setCopiedWebhook(true);
        setTimeout(() => setCopiedWebhook(false), 2000);
      } else {
        setCopiedCallback(true);
        setTimeout(() => setCopiedCallback(false), 2000);
      }
      toast({
        title: "Copied to clipboard",
        description: `${type === 'webhook' ? 'Webhook' : 'Callback'} URL copied successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please copy the URL manually.",
      });
    }
  };

  const setupSteps = [
    {
      title: "Configure Webhook URL",
      description: "Add this webhook URL to your Whop app settings to receive real-time subscription updates.",
      url: webhookUrl,
      isCopied: copiedWebhook,
      onCopy: () => copyToClipboard(webhookUrl, 'webhook'),
      buttonText: "Copy Webhook URL"
    },
    {
      title: "Set OAuth Callback URL", 
      description: "Configure this callback URL in your Whop OAuth settings for user authentication.",
      url: callbackUrl,
      isCopied: copiedCallback,
      onCopy: () => copyToClipboard(callbackUrl, 'callback'),
      buttonText: "Copy Callback URL"
    }
  ];

  const requirements = [
    "Whop API key configured in Supabase secrets",
    "App ID, Agent User ID, and Company ID set",
    "Database schema updated for Whop integration",
    "Edge functions deployed for webhooks and auth"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <Badge className="w-fit mb-2 bg-blue-100 text-blue-700 border-blue-200">
            Whop Integration Setup
          </Badge>
          <CardTitle>Complete Your Whop Integration</CardTitle>
          <CardDescription>
            Follow these steps to finish setting up LegalDeep AI with Whop marketplace.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Requirements Check */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Prerequisites ✓
            </h3>
            <div className="grid gap-2">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{requirement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Setup Steps */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
              Configuration Steps
            </h3>
            <div className="space-y-4">
              {setupSteps.map((step, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                        <div className="bg-muted rounded-md p-3 font-mono text-xs break-all">
                          {step.url}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={step.onCopy}
                        className="flex-shrink-0"
                      >
                        {step.isCopied ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Instructions */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Next Steps in Whop Dashboard:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Go to your Whop developer dashboard</li>
              <li>Navigate to your app settings</li>
              <li>Add the webhook URL to receive subscription events</li>
              <li>Configure the OAuth callback URL for user authentication</li>
              <li>Test the integration with a test purchase</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open('https://dev.whop.com', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Whop Dashboard
            </Button>
            {onComplete && (
              <Button onClick={onComplete} className="flex-1">
                Continue Setup
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}