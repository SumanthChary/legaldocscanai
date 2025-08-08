
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageLayout } from "@/components/layout";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingToggle } from "@/components/pricing/PricingToggle";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { AddOns } from "@/components/pricing/AddOns";
import { RedeemCodeModal } from "@/components/pricing/RedeemCodeModal";
import { getPricingPlans } from "@/components/pricing/pricingData";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  
  const plans = getPricingPlans(isAnnual);
  const addOns: any[] = [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 md:py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center text-xs sm:text-sm py-2 rounded-md">
              Limited-time: 40% OFF — Lock in your savings today.
            </div>
          </div>
          <PricingHeader onRedeemClick={() => setIsRedeemModalOpen(true)} />
          <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
          <PricingPlans plans={plans} isAnnual={isAnnual} />
          {addOns.length > 0 && <AddOns addOns={addOns} />}
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
