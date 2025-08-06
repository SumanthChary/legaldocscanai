
import { PageLayout } from "@/components/layout";
import { ProfessionalHero } from "@/components/blocks/professional-hero";
import { LawFirmLogos } from "@/components/blocks/law-firm-logos";
import { TransparentPricing } from "@/components/blocks/transparent-pricing";
import { IntegrationsShowcase } from "@/components/blocks/integrations-showcase";
import { FounderCredibility } from "@/components/blocks/founder-credibility";
import { FinalCtaSection } from "@/components/blocks/final-cta-section";
import { FAQSection } from "@/components/blocks/faq-section";
import { useEffect } from "react";

const Landing = () => {
  const faqs = [
    {
      question: "How much time will LegalDeep AI save me per contract?",
      answer: "On average, our users save 2.3 hours per contract review. What typically takes 3-4 hours for a senior associate can be completed in 45 minutes with LegalDeep AI's assistance, including AI analysis, risk assessment, and citation verification."
    },
    {
      question: "Is my client data secure with LegalDeep AI?", 
      answer: "Absolutely. We maintain SOC 2 Type II certification, HIPAA compliance, and follow ABA technology guidelines. Most importantly, we have a zero data retention policy - your documents are processed and immediately deleted, never stored on our servers."
    },
    {
      question: "Do I need to change my existing workflow?",
      answer: "No. LegalDeep AI integrates seamlessly with Clio, LexisNexis, Westlaw, and other tools you already use. Upload documents directly from your DMS, get AI analysis, and results flow back into your existing systems. Setup takes under 5 minutes."
    },
    {
      question: "What's included in the 14-day free trial?",
      answer: "Full access to all features with no credit card required. Analyze unlimited contracts, test all integrations, and experience the full platform. If you don't save at least 2 hours on your first contract, we'll refund your money plus send a $50 gift card."
    },
    {
      question: "How accurate is the AI compared to human review?",
      answer: "Our AI maintains 94% accuracy in risk identification and has been trained on 50+ million legal documents. It identifies issues human reviewers often miss due to fatigue or time pressure. However, it's designed to augment, not replace, your legal expertise."
    },
    {
      question: "Can I use this for client-sensitive documents?",
      answer: "Yes. We're built for BigLaw-level security with attorney-client privilege protection, end-to-end encryption, and zero data retention. Many Am Law 100 firms trust us with their most sensitive M&A and securities work."
    },
    {
      question: "What if I need custom AI training for my practice area?",
      answer: "Our Enterprise plan includes custom AI model training for your specific practice area, clause libraries, and document types. We can also provide dedicated deployment for maximum security and customization."
    },
    {
      question: "How quickly can I see ROI?",
      answer: "Most users see immediate ROI on their first contract. At an average billing rate of $400/hour, saving 2.3 hours per contract means each analysis pays for a month of our service. Most firms recoup their annual subscription cost in the first week."
    }
  ];

  const testimonials = [
    {
      author: {
        name: "Sarah Johnson",
        handle: "@sarahlegal",
        avatar: "/lovable-uploads/d4f6190e-3f8c-497d-b549-b42ff6e42fc9.png"
      },
      text: "LegalDeep AI has revolutionized how we handle legal documents. The AI-powered analysis saves us countless hours of manual review.",
      href: "https://twitter.com/sarahlegal"
    },
    {
      author: {
        name: "Michael Chen",
        handle: "@mchenlaw",
        avatar: "/lovable-uploads/35e692b0-631a-4e2b-aa40-cb49baefe0bc.png"
      },
      text: "The accuracy and speed of document analysis are remarkable. It's become an indispensable tool for our law firm.",
      href: "https://twitter.com/mchenlaw"
    },
    {
      author: {
        name: "Emily Rodriguez",
        handle: "@emilylaw",
        avatar: "/lovable-uploads/a579bbd7-742e-438a-9342-e6a274fad70e.png"
      },
      text: "Finally, a legal tech solution that actually understands context! The accuracy in legal document processing is impressive."
    },
    {
      author: {
        name: "David Wilson",
        handle: "@davidwilsonlaw",
        avatar: "/lovable-uploads/438ac072-620d-4a9f-ab0b-22342130bced.png"
      },
      text: "This platform has transformed our document workflow. The AI insights help us identify critical clauses and potential issues quickly."
    },
    {
      author: {
        name: "Jessica Thompson",
        handle: "@jessicaesq",
        avatar: "/lovable-uploads/dde2af26-05a4-45a1-b170-0b6f52391280.png"
      },
      text: "The time savings are incredible. What used to take hours now takes minutes, and the analysis quality is consistently excellent."
    },
    {
      author: {
        name: "Alex Rodriguez",
        handle: "@alexlegal",
        avatar: "/lovable-uploads/f08be41c-008a-4051-8ed1-425c928d09c0.png"
      },
      text: "As a solo practitioner, this tool levels the playing field. I can now handle complex document analysis with confidence and efficiency."
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
    <div className="bg-white">
      <PageLayout>
        <ProfessionalHero />
        <LawFirmLogos />
        <TransparentPricing />
        <IntegrationsShowcase />
        <FounderCredibility />
        <FinalCtaSection />
        <div className="bg-navy-50">
          <FAQSection faqs={faqs} />
        </div>
      </PageLayout>
    </div>
  );
};

export default Landing;
