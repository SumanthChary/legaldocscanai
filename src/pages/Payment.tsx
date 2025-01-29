import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, CreditCardIcon } from "lucide-react";
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
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("No user found");

      // Convert plan name to subscription_tier enum value
      const planType = plan.name.toLowerCase() as SubscriptionTier;

      // Create subscription record
      const { error } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        plan_type: planType,
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days from now
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Complete Your Purchase
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-4">
              <span>{plan.name} Plan</span>
              <span>{plan.price}{plan.period}</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{plan.price}{plan.period}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <CreditCardIcon className="h-5 w-5" />
                    PayPal
                  </h3>
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "USD",
                              value: amount,
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={handlePayPalApprove}
                    style={{ layout: "horizontal" }}
                    disabled={loading}
                  />
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5" />
                    Credit Card
                  </h3>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => 
                      toast({
                        title: "Coming Soon",
                        description: "Credit card payments will be available soon!",
                      })
                    }
                  >
                    Pay with Card (Coming Soon)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;