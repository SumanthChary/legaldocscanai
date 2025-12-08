import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield, Zap, Crown, ArrowRight, Sparkles } from "lucide-react";
import { getPricingPlans } from "@/components/pricing/pricingData";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { Database } from "@/integrations/supabase/types";

type SubscriptionTier = Database["public"]["Enums"]["subscription_tier"];

const PAY_PER_USE_PLAN = {
  name: "Scan Plan",
  price: "$19",
  period: "per scan",
  description: "Pay only when you need an AI-powered clause review.",
  features: [
    "Unlimited pages per upload",
    "95%+ accuracy from pricing site",
    "Clause heatmap + PDF export",
  ],
  buttonLabel: "Scan now",
  tier: "pay_per_document" as SubscriptionTier,
};

const UNLIMITED_PRO_PLAN = {
  name: "Unlimited Pro",
  price: "$47",
  period: "/mo",
  description: "All-inclusive plan with team sharing and priority AI.",
  features: [
    "Unlimited scans & uploads",
    "Shared workspace for teams",
    "Priority AI queue & support",
  ],
  buttonLabel: "Subscribe",
  tier: "professional" as SubscriptionTier,
};

export default function MobilePlans() {
  const navigate = useNavigate();
  const { analyses } = useAnalyses();

  const pricingPlans = useMemo(() => getPricingPlans(false), []);

  const summaryTiles = [
    { label: "Scans", value: analyses.length || 3 },
    { label: "Risks", value: Math.max(analyses.length * 4, 8) },
    { label: "Saved", value: `$${(analyses.length * 11.6 + 11.6).toFixed(1)}K` },
    { label: "Accuracy", value: "89% Avg" },
  ];

  const handleCheckout = (plan: { name: string; price: string; period: string; description: string; tier: SubscriptionTier }) => {
    navigate("/payment", {
      state: {
        plan,
      },
    });
  };

  return (
    <MobileLayout>
      <div className="mx-auto flex min-h-screen max-w-sm flex-col bg-[#F6F8F7]">
        <MobileHeader title="Plans" />
        <main className="flex-1 space-y-5 px-4 pb-32 pt-5">
          <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Lifetime value</p>
                <h2 className="mt-2 font-display text-3xl text-slate-900">$12k saved</h2>
                <p className="text-sm text-slate-500">vs $500 lawyer per contract</p>
              </div>
              <Badge className="rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">Unlimited scans</Badge>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {summaryTiles.map((tile) => (
                <div key={tile.label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{tile.label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{tile.value}</p>
                </div>
              ))}
            </div>
          </section>

          {[PAY_PER_USE_PLAN, UNLIMITED_PRO_PLAN].map((plan, index) => (
            <Card
              key={plan.name}
              className={`rounded-[32px] border ${index === 0 ? "border-slate-900" : "border-slate-200"} bg-white p-6 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">{plan.name === "Scan Plan" ? "Scan plan" : "Subscription"}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-sm font-semibold text-slate-500">{plan.period}</span>
                  </div>
                </div>
                {plan.name === "Scan Plan" ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Recommended</span>
                ) : (
                  <Crown className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <p className="mt-3 text-sm text-slate-500">{plan.description}</p>
              <div className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-900">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {feature}
                  </div>
                ))}
              </div>
              <Button
                className={`mt-5 w-full rounded-2xl text-base font-semibold ${plan.name === "Scan Plan" ? "bg-slate-900 text-white" : "bg-white text-slate-900 border border-slate-900"}`}
                onClick={() =>
                  plan.name === "Scan Plan"
                    ? navigate("/scan")
                    : handleCheckout({ name: plan.name, price: plan.price, period: plan.period, description: plan.description, tier: plan.tier })
                }
              >
                {plan.buttonLabel}
              </Button>
            </Card>
          ))}

          <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-slate-400">
              <Sparkles className="h-4 w-4 text-emerald-500" /> Plans from legaldeepai.app/pricing
            </div>
            <p className="mt-3 text-sm text-slate-500">Full plan matrix pulled from the public pricing page.</p>
            <div className="mt-5 space-y-4">
              {pricingPlans.map((plan) => {
                const normalizedPrice = plan.price === "Custom" ? "Custom" : `$${plan.price}`;
                const isEnterprise = plan.name.toLowerCase() === "enterprise";
                return (
                  <div key={plan.name} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
                      <p className="text-xs text-slate-500">{plan.description}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-black text-slate-900">{normalizedPrice}</p>
                        {plan.period && <p className="text-xs text-slate-500">{plan.period}</p>}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    {plan.features.slice(0, 4).map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-emerald-500" /> {feature}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-3 w-full justify-between rounded-2xl border border-dashed border-slate-200 text-slate-900"
                      onClick={() =>
                        isEnterprise
                          ? typeof window !== "undefined" && (window.location.href = "mailto:sales@legaldeepai.app")
                              : handleCheckout({
                              name: plan.name,
                              price: normalizedPrice,
                              period: plan.period || "",
                              description: plan.description,
                              tier: plan.tier,
                            })
                      }
                  >
                      {isEnterprise ? "Talk to sales" : "Choose plan"}
                      <ArrowRight className="h-4 w-4" />
                  </Button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[32px] border border-emerald-100 bg-emerald-50/80 p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="font-semibold text-slate-900">Bank-grade encryption</p>
                <p className="text-sm text-slate-600">Auto-delete after 24h · 14-day money-back guarantee · Apple Pay and PayPal supported.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </MobileLayout>
  );
}
