import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Settings, 
  Download,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const SubscriptionManagement = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        // Mock subscription data based on profile
        const mockSubscription = {
          plan: 'starter',
          status: 'active',
          nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          amount: 19.90,
          documentsUsed: profile.document_count || 0,
          documentsLimit: profile.document_limit || 25
        };
        setSubscription(mockSubscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = () => {
    toast({
      title: "Subscription Cancellation",
      description: "Please contact support to cancel your subscription.",
    });
  };

  const handleUpgradePlan = () => {
    window.location.href = '/pricing';
  };

  const handleDownloadInvoice = () => {
    toast({
      title: "Invoice Download",
      description: "Your invoice will be sent to your email address.",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="h-48 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Subscription Management</h2>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing
              </CardDescription>
            </div>
            <Badge variant={subscription?.status === 'active' ? 'default' : 'destructive'}>
              {subscription?.status || 'Free'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Plan</div>
              <div className="text-lg font-semibold capitalize">
                {subscription?.plan || 'Free'} Plan
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Next Billing</div>
              <div className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {subscription?.nextBilling ? 
                  subscription.nextBilling.toLocaleDateString() : 
                  'N/A'
                }
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                ${subscription?.amount || '0'}/month
              </div>
            </div>
          </div>

          <Separator />

          {/* Usage */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Usage This Month</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Documents Analyzed</span>
                <span className="text-sm font-medium">
                  {subscription?.documentsUsed || 0} / {subscription?.documentsLimit || 3}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, ((subscription?.documentsUsed || 0) / (subscription?.documentsLimit || 3)) * 100)}%` 
                  }}
                ></div>
              </div>
              {subscription?.documentsUsed >= subscription?.documentsLimit * 0.8 && (
                <div className="flex items-center gap-2 text-orange-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  You're approaching your monthly limit
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleUpgradePlan}>
              Upgrade Plan
            </Button>
            <Button variant="outline" onClick={handleDownloadInvoice}>
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription}>
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View your past invoices and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">
                      {subscription?.plan || 'Starter'} Plan
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(Date.now() - (index + 1) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">
                    ${subscription?.amount || '19.90'}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};