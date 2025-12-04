import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { supabase } from "@/integrations/supabase/client";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Shield, CheckCircle, Loader2, ArrowLeft, Lock, Check } from "lucide-react";
import "./Payment.css";
import { Database } from "@/integrations/supabase/types";

type SubscriptionTier = Database["public"]["Enums"]["subscription_tier"];

interface LocationState {
  plan?: {
    name: string;
    price: string;
    period: string;
    description?: string;
  };
}


const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { plan } = (location.state as LocationState) || {};
  const [selectedPlan, setSelectedPlan] = useState<LocationState["plan"] | null>(plan || null);

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Auth error:", error);
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue with payment.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        
        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to continue with payment.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error("Unexpected error checking user:", error);
        navigate("/auth");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUser();
  }, [navigate, toast]);

  useEffect(() => {
    if (!plan && !checkingAuth) {
      toast({
        title: "No Plan Selected",
        description: "Please select a plan from the pricing page.",
        variant: "destructive",
      });
      navigate("/pricing");
    }
  }, [plan, navigate, toast, checkingAuth]);

  useEffect(() => {
    if (plan) {
      setSelectedPlan(plan);
    }
  }, [plan]);

  const planOptions = useMemo(
    () => [
      {
        name: "Scan Plan",
        label: "SCAN PLAN",
        price: "$19",
        period: "per scan",
        recommended: true,
        buttonLabel: "Scan Now",
        features: [
          "3-min AI contract scan",
          "Clause-by-clause highlights",
          "Downloadable PDF summary",
        ],
        extrasLabel: "and 7+ features sourced from legaldeepai.app/pricing",
      },
      {
        name: "Unlimited Pro",
        label: "UNLIMITED PRO",
        price: "$47",
        period: "/mo",
        recommended: false,
        buttonLabel: "Subscribe",
        features: [
          "Unlimited scans & uploads",
          "Shared team workspace",
          "Priority AI + support queue",
        ],
        extrasLabel: "and 15+ platform features from legaldeepai.app/pricing",
      },
    ],
    []
  );

  if (checkingAuth) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!plan || !user) {
    return null;
  }

  const activePlan = selectedPlan || plan;
  const amount = activePlan.price.replace(/[^0-9.]/g, "");
  const avatarFallback = user?.email?.[0]?.toUpperCase() || "L";

  const summaryFeatures = [
    "Real-time clause insights",
    "Download-ready reports",
    "Cancel anytime guarantee",
  ];
  const summaryExtrasLabel = "Plus additional benefits listed on legaldeepai.app/pricing";

  const handlePayPalApprove = async (data: any, actions: any) => {
    try {
      setLoading(true);
      const details = await actions.order.capture();
      console.log("PayPal transaction completed:", details);
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const planType = activePlan.name.toLowerCase().replace(/\s+/g, '_') as SubscriptionTier;

      // Call our Supabase Edge Function to process the payment
      const { data: processResult, error: processError } = await supabase.functions.invoke(
        'process-paypal-payment',
        {
          body: {
            orderId: details.id,
            userId: user.id,
            planType,
            amount: amount
          }
        }
      );

      if (processError) {
        throw new Error(processError.message || 'Payment processing failed');
      }

      if (!processResult.success) {
        throw new Error(processResult.message || 'Payment processing failed');
      }

      toast({
        title: "Payment Successful!",
        description: `You are now subscribed to the ${activePlan.name} plan!`,
        duration: 5000,
      });
      
      // Redirect to success page with plan details
      navigate(`/payment-success?plan=${encodeURIComponent(activePlan.name)}&amount=${amount}`);
      
    } catch (error: any) {
      console.error("Payment processing error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "There was an error processing your payment. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalError = (err: any) => {
    console.error("PayPal error:", err);
    const errorMessage = err.message || "There was an error with PayPal.";
    toast({
      title: "Payment Error",
      description: `${errorMessage} Please try again or contact support.`,
      variant: "destructive",
    });
  };

  const handlePayPalCancel = () => {
    toast({
      title: "Payment Cancelled",
      description: "You can always come back to complete your subscription.",
    });
  };

  // PayPal configuration
  const paypalOptions = {
    clientId: "AZiHrC_GIm4eru7Ql0zgdwXuBv9tWhcL-WE1ZQyCIBIKGFvGWTt5r9IcPXrkVm8fWlDhzRuMF9IGBD0_",
    currency: "USD",
    intent: "capture",
    components: "buttons",
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#f6f8f7] py-6 md:py-10">
        <div className="mx-auto max-w-5xl px-4 space-y-6">
          <header className="flex h-20 items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-serif text-2xl italic text-slate-900">Choose Plan</h1>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-semibold">
              {avatarFallback}
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Lifetime value</p>
                <p className="text-lg text-slate-500">$12k saved by founders</p>
                <p className="text-lg text-slate-500">vs $500 lawyer per contract</p>
              </section>

              <div className="grid gap-4 md:grid-cols-2">
                {planOptions.map((option) => {
                  const isActive = activePlan.name.toLowerCase() === option.name.toLowerCase();
                  return (
                    <div
                      key={option.name}
                      className={`relative rounded-2xl border p-6 transition ${
                        isActive ? "border-primary shadow-sm" : "border-slate-200"
                      }`}
                    >
                      {option.recommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                          Recommended
                        </div>
                      )}
                      <div className="space-y-3 pt-1">
                        <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                          {option.label}
                        </p>
                        <div>
                          <span className="text-5xl font-black text-primary">{option.price}</span>
                          <span className="ml-1 text-base font-bold text-slate-900">
                            {option.period}
                          </span>
                        </div>
                        <Button
                          onClick={() => setSelectedPlan(option)}
                          className={`h-12 w-full rounded-xl text-base font-semibold ${
                            isActive
                              ? "bg-primary text-white"
                              : "bg-transparent text-primary border border-primary"
                          }`}
                        >
                          {option.buttonLabel}
                        </Button>
                        <div className="space-y-2 pt-2">
                          {option.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm text-slate-900">
                              <Check className="h-4 w-4 text-primary" />
                              {feature}
                            </div>
                          ))}
                          <p className="text-xs text-slate-500">{option.extrasLabel}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold text-slate-900">Bank-grade encryption</p>
                    <p className="text-sm text-slate-600">Auto-delete scans after 24h · 14-day guarantee</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Selected plan</p>
                    <p className="text-lg font-semibold text-slate-900">{activePlan.name}</p>
                  </div>
                  <p className="text-3xl font-black text-slate-900">
                    {activePlan.price}
                    <span className="ml-1 text-base font-semibold">{activePlan.period}</span>
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  {summaryFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      {feature}
                    </div>
                  ))}
                  <p className="text-xs text-slate-500">{summaryExtrasLabel}</p>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-black text-white">
                      <span className="text-xs">Apple</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Apple Pay •••• 4242</p>
                      <p className="text-xs text-slate-500">Primary checkout method</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">$19.00 USD</p>
                </div>
              </section>

              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <p className="text-base font-semibold text-slate-900">Checkout</p>
                </div>
                <div className="border border-slate-200 rounded-2xl p-4">
                  <div id="paypal-button-container" className="w-full">
                    <PayPalScriptProvider options={paypalOptions}>
                      {loading ? (
                        <div className="flex items-center justify-center gap-2 py-6 text-primary">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing payment...
                        </div>
                      ) : (
                        <PayPalButtons
                          style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              intent: "CAPTURE",
                              purchase_units: [
                                {
                                  amount: {
                                    value: amount,
                                    currency_code: "USD",
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={handlePayPalApprove}
                          onCancel={handlePayPalCancel}
                          onError={handlePayPalError}
                        />
                      )}
                    </PayPalScriptProvider>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">Need a different method?</p>
                  <p className="text-slate-500">Razorpay + cards are coming soon. PayPal keeps your documents private and protected.</p>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-white">
                  <p className="text-sm font-semibold">No subscription trap</p>
                  <p className="text-xs text-slate-200">Pay per value. Cancel anytime.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Payment;
