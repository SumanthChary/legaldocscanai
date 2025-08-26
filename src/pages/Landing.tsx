
import { PageLayout } from "@/components/layout";
import { HeroSection } from "@/components/blocks/hero-section";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import { AboutSection } from "@/components/blocks/about-section";
import { TrustSection } from "@/components/blocks/trust-section";
import { FAQSection } from "@/components/blocks/faq-section";
import { PricingSection } from "@/components/blocks/pricing-section";
import { HowItWorksSection } from "@/components/blocks/how-it-works-section";
import { AboutAuthorSection } from "@/components/blocks/about-author-section";
import { FeaturedSection } from "@/components/blocks/featured-section";
import { PowerfulFeaturesSection } from "@/components/blocks/powerful-features-section";
import { WhopService } from "@/integrations/whop";
import { WhopWelcomeUpsell } from "@/components/whop";
import { useEffect, useState } from "react";

const Landing = () => {
  const [isWhopUser, setIsWhopUser] = useState(false);

  useEffect(() => {
    setIsWhopUser(WhopService.isWhopUser());
  }, []);
  const benefits = [
    "Reduce review time by 90%",
    "Improve analysis accuracy", 
    "Ensure compliance across jurisdictions",
    "Streamline team collaboration"
  ];

  const faqs = [
    {
      question: "What is LegalDeep AI?",
      answer: "LegalDeep AI is currently in BETA development - an AI-powered platform designed to help legal professionals analyze and summarize legal documents. We're actively improving based on feedback from early adopters."
    },
    {
      question: "How secure is my data on LegalDeep AI?",
      answer: "We prioritize security with encryption and secure data handling practices. However, as we're in beta, we recommend reviewing our privacy policy and using test documents during this development phase."
    },
    {
      question: "What types of documents can LegalDeep AI process?",
      answer: "Our beta platform can process various legal documents including contracts and agreements. We've successfully analyzed 56+ documents during our testing phase and are continuously expanding our capabilities."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer 3 free document analyses so you can experience our beta platform. This helps us gather feedback while allowing you to test our capabilities."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our beta platform shows promising results in document analysis. However, as we're still in development, we strongly recommend using it as a supportive tool alongside professional legal judgment, not as a replacement for legal expertise."
    },
    {
      question: "Can I integrate LegalDeep AI with my existing workflow?",
      answer: "We're working on integration capabilities as part of our beta development. Currently, we offer basic document processing with plans to add more workflow features based on user feedback."
    }
  ];
  
  // Add smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <PageLayout withBanner={!isWhopUser}>
        <HeroSection benefits={benefits} isWhopUser={isWhopUser} />
        <FeaturedSection />
        <HowItWorksSection />
        <PowerfulFeaturesSection />
        <TrustSection />
        {/* Show special Whop upsell for Whop users */}
        {isWhopUser && <WhopWelcomeUpsell />}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/50">
          <PricingSection />
        </div>
        <div className="bg-white/90 backdrop-blur-sm">
          <TestimonialsSection />
        </div>
        <AboutAuthorSection />
        <div className="bg-gradient-to-br from-slate-50 to-gray-100/50">
          <AboutSection />
        </div>
        <div className="bg-white/90 backdrop-blur-sm">
          <FAQSection faqs={faqs} />
        </div>
      </PageLayout>
    </div>
  );
};

export default Landing;
