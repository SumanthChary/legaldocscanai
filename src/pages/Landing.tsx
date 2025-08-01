
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
import { LegalTestimonials } from "@/components/legal/LegalTestimonials";
import { CalendarBookingWidget } from "@/components/legal/CalendarBookingWidget";
import { SavingsCalculator } from "@/components/legal/SavingsCalculator";
import { useEffect } from "react";

const Landing = () => {
  const benefits = [
    "Attorney work product privileged",
    "SOC 2 & GDPR compliant security", 
    "Zero data retention policy",
    "85% faster document review"
  ];

  const faqs = [
    {
      question: "What is DocBriefly AI?",
      answer: "DocBriefly AI is an advanced AI-powered platform designed to help legal professionals analyze, summarize, and extract key information from legal documents efficiently. Our tool uses cutting-edge technology to save time and improve accuracy in legal document processing."
    },
    {
      question: "How secure is my data on DocBriefly AI?",
      answer: "We prioritize your data security with end-to-end encryption and compliance with major privacy regulations including GDPR, HIPAA, and SOC 2. All documents are stored securely with bank-grade encryption, and we maintain strict access controls to ensure your sensitive legal information remains confidential and attorney work product privileged."
    },
    {
      question: "What types of documents can DocBriefly AI process?",
      answer: "DocBriefly AI can process a wide range of legal documents including contracts, agreements, legal briefs, court documents, regulatory filings, depositions, and complex PDFs with images and charts. Our advanced AI can handle multiple formats and extract insights from both text and visual content."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a free tier that allows you to analyze up to 3 documents to experience our platform's capabilities. You can upgrade to our professional or enterprise plans for additional features and higher document limits."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI system maintains a high accuracy rate in document analysis and summary generation, powered by advanced models including Llama 4 and specialized legal training. However, we recommend using it as a supportive tool alongside professional legal judgment, not as a replacement for legal expertise."
    },
    {
      question: "Can I integrate DocBriefly AI with my existing workflow?",
      answer: "Absolutely! DocBriefly AI is designed to seamlessly integrate with your existing legal workflow. Our platform offers API access, bulk processing capabilities, and integrations with popular legal software like Clio, LexisNexis, and Westlaw."
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
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <PageLayout>
        <HeroSection benefits={benefits} />
        <FeaturedSection />
        <HowItWorksSection />
        <PowerfulFeaturesSection />
        
        {/* Legal Testimonials Section */}
        <LegalTestimonials />
        
        {/* Demo Booking and Calculator Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <CalendarBookingWidget />
              <div>
                <SavingsCalculator />
              </div>
            </div>
          </div>
        </div>
        
        <TrustSection />
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/50">
          <PricingSection />
        </div>
        <div className="bg-white/90 backdrop-blur-sm">
          <TestimonialsSection
            title="Trusted by Legal Professionals Worldwide"
            description="Join thousands of legal professionals who are already transforming their document workflow with DocBriefly AI"
            testimonials={testimonials}
          />
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
