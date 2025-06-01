
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { supabase } from "@/integrations/supabase/client";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Shield, CheckCircle } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type SubscriptionTier = Database["public"]["Enums"]["subscription_tier"];

interface LocationState {
  plan?: {
    name: string;
    price: string;
    period: string;
  };
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { plan } = (location.state as LocationState) || {};

  useEffect(() => {
    if (!plan) {
      navigate("/pricing");
    }
  }, [plan, navigate]);

  if (!plan) {
    return null;
  }

  const amount = plan.price.replace("$", "");

  const handlePayPalApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      console.log("Transaction completed by", details.payer.name.given_name);
      
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("No user found");

      const planType = plan.name.toLowerCase().replace(/\s+/g, '_') as SubscriptionTier;

      const { error } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        plan_type: planType,
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Payment Successful",
        description: `You are now subscribed to the ${plan.name} plan!`,
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalError = (err: any) => {
    console.error("PayPal error:", err);
    toast({
      title: "Payment Error",
      description: "There was an error processing your payment. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Complete Your Subscription
              </h1>
              <p className="text-xl text-gray-600">
                Secure payment processing with enterprise-grade encryption
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-blue-600" />
                  Order Summary
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-semibold text-gray-900">{plan.name} Plan</h3>
                      <p className="text-gray-600">Professional AI document analysis</p>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {plan.price}<span className="text-sm text-gray-500">{plan.period}</span>
                    </span>
                  </div>
                  
                  <div className="space-y-3 py-4">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Unlimited document analysis</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Advanced AI insights</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>Priority support</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {plan.price}<span className="text-lg">{plan.period}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
                  Payment Method
                </h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                      PayPal - Secure & Instant
                    </h3>
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              amount: {
                                currency_code: "USD",
                                value: amount,
                              },
                              payee: {
                                email_address: "enjoywithpandu@gmail.com"
                              }
                            },
                          ],
                        });
                      }}
                      onApprove={handlePayPalApprove}
                      onError={handlePayPalError}
                      style={{ layout: "horizontal", color: "blue", shape: "pill" }}
                      disabled={loading}
                    />
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 opacity-50">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                      Credit Card - Coming Soon
                    </h3>
                    <Button
                      className="w-full h-12 bg-gray-100 text-gray-500 cursor-not-allowed"
                      disabled
                    >
                      Credit Card Payment (Coming Soon)
                    </Button>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Secure Payment Processing</p>
                      <p>Your payment information is encrypted and secure. We never store your payment details.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Payment;
