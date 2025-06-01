
import { PageLayout } from "@/components/layout";
import { HeroSection } from "@/components/blocks/hero-section";
import { FeaturesSection } from "@/components/blocks/features-section";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import { AboutSection } from "@/components/blocks/about-section";
import { FAQSection } from "@/components/blocks/faq-section";
import { CTASection } from "@/components/blocks/cta-section";
import { PricingSection } from "@/components/blocks/pricing-section";
import { TrustIndicators } from "@/components/blocks/trust-indicators";
import { SocialProof } from "@/components/blocks/social-proof";
import { SecurityBadges } from "@/components/blocks/security-badges";
import { useEffect } from "react";

const Landing = () => {
  const benefits = [
    "Reduce review time by 75%",
    "Improve analysis accuracy by 90%",
    "Ensure 100% compliance across jurisdictions",
    "Streamline team collaboration instantly"
  ];

  const faqs = [
    {
      question: "What is LegalBriefAI?",
      answer: "LegalBriefAI is an advanced AI-powered platform designed to help legal professionals analyze, summarize, and extract key information from legal documents efficiently. Our tool uses cutting-edge technology to save time and improve accuracy in legal document processing."
    },
    {
      question: "How secure is my data on LegalBriefAI?",
      answer: "We prioritize your data security with enterprise-grade end-to-end encryption, SOC 2 Type II compliance, and adherence to major privacy regulations including GDPR and CCPA. All documents are stored in secure, isolated environments with strict access controls."
    },
    {
      question: "What types of documents can LegalBriefAI process?",
      answer: "LegalBriefAI can process a wide range of legal documents including contracts, agreements, legal briefs, court documents, regulatory filings, NDAs, and more. Our system is trained on millions of legal documents across various practice areas."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes! Start with 3 completely free document analyses - no credit card required. Experience our platform's full capabilities before deciding to upgrade to our professional plans."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI system maintains 95%+ accuracy in document analysis, continuously validated by legal experts. While highly reliable, we recommend using it alongside professional legal judgment for critical decisions."
    },
    {
      question: "What's your money-back guarantee?",
      answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with our service, we'll refund your payment, no questions asked."
    }
  ];

  const testimonials = [
    {
      author: {
        name: "Sarah Johnson",
        handle: "@sarahlegal",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
      },
      text: "LegalBriefAI has revolutionized how we handle legal documents. The AI-powered analysis saves us countless hours of manual review. ROI was immediate.",
      href: "https://twitter.com/sarahlegal"
    },
    {
      author: {
        name: "Michael Chen",
        handle: "@mchenlaw",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      text: "The accuracy and speed are remarkable. We've reduced document review time by 80% while improving our analysis quality. Game-changer for our firm.",
      href: "https://twitter.com/mchenlaw"
    },
    {
      author: {
        name: "Emily Rodriguez",
        handle: "@emilylaw",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
      },
      text: "Finally, a legal tech solution that actually understands context! The security features give us complete peace of mind with sensitive documents."
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
      <PageLayout>
        <HeroSection benefits={benefits} />
        
        {/* Trust Indicators */}
        <div className="bg-white/90 backdrop-blur-sm border-y border-gray-100">
          <TrustIndicators />
        </div>
        
        {/* Social Proof */}
        <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/30">
          <SocialProof />
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm">
          <FeaturesSection />
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/50">
          <PricingSection />
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm">
          <TestimonialsSection
            title="Trusted by 10,000+ Legal Professionals Worldwide"
            description="Join industry leaders who've transformed their document workflow and saved thousands of hours"
            testimonials={testimonials}
          />
        </div>
        
        {/* Security Badges */}
        <div className="bg-slate-50/80">
          <SecurityBadges />
        </div>
        
        <div className="bg-gradient-to-br from-slate-50 to-gray-100/50">
          <AboutSection />
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm" id="faqs">
          <FAQSection faqs={faqs} />
        </div>
        
        <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/30">
          <CTASection />
        </div>
      </PageLayout>
    </div>
  );
};

export default Landing;
