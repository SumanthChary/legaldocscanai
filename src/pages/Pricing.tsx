
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageLayout } from "@/components/layout";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingToggle } from "@/components/pricing/PricingToggle";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { AddOns } from "@/components/pricing/AddOns";
import { RedeemCodeModal } from "@/components/pricing/RedeemCodeModal";
import { getPricingPlans, getAddOns } from "@/components/pricing/pricingData";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  
  const plans = getPricingPlans(isAnnual);
  const addOns = getAddOns();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <PricingHeader onRedeemClick={() => setIsRedeemModalOpen(true)} />
          <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
          <PricingPlans plans={plans} isAnnual={isAnnual} />
          <AddOns addOns={addOns} />
        </div>
      </main>
      <Footer />
      
      <RedeemCodeModal 
        isOpen={isRedeemModalOpen} 
        onClose={() => setIsRedeemModalOpen(false)} 
      />
    </div>
  );
};

export default Pricing;
