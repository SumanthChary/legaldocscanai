
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/blocks/hero-section";
import { FeaturesSection } from "@/components/blocks/features-section";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import { AboutSection } from "@/components/blocks/about-section";
import { FAQSection } from "@/components/blocks/faq-section";
import { CTASection } from "@/components/blocks/cta-section";

const Landing = () => {
  const benefits = [
    "Reduce document review time by 75%",
    "Improve accuracy in legal analysis",
    "Ensure compliance across jurisdictions",
    "Streamline team collaboration"
  ];

  const faqs = [
    {
      question: "What is LegalBriefAI?",
      answer: "LegalBriefAI is an advanced AI-powered platform designed to help legal professionals analyze, summarize, and extract key information from legal documents efficiently. Our tool uses cutting-edge technology to save time and improve accuracy in legal document processing."
    },
    {
      question: "How secure is my data on LegalBriefAI?",
      answer: "We prioritize your data security with end-to-end encryption and compliance with major privacy regulations. All documents are stored securely, and we maintain strict access controls to ensure your sensitive legal information remains confidential."
    },
    {
      question: "What types of documents can LegalBriefAI process?",
      answer: "LegalBriefAI can process a wide range of legal documents including contracts, agreements, legal briefs, court documents, and regulatory filings. Our system is trained to understand complex legal terminology across various practice areas."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a free tier that allows you to analyze up to 3 documents to experience our platform's capabilities. You can upgrade to our professional or enterprise plans for additional features and higher document limits."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI system maintains a high accuracy rate in document analysis and summary generation. However, we recommend using it as a supportive tool alongside professional legal judgment, not as a replacement for legal expertise."
    }
  ];

  const testimonials = [
    {
      author: {
        name: "Sarah Johnson",
        handle: "@sarahlegal",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
      },
      text: "LegalBriefAI has revolutionized how we handle legal documents. The AI-powered analysis saves us countless hours of manual review.",
      href: "https://twitter.com/sarahlegal"
    },
    {
      author: {
        name: "Michael Chen",
        handle: "@mchenlaw",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      text: "The accuracy and speed of document analysis are remarkable. It's become an indispensable tool for our law firm.",
      href: "https://twitter.com/mchenlaw"
    },
    {
      author: {
        name: "Emily Rodriguez",
        handle: "@emilylaw",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
      },
      text: "Finally, a legal tech solution that actually understands context! The accuracy in legal document processing is impressive."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection benefits={benefits} />
        <FeaturesSection />
        <TestimonialsSection
          title="Trusted by Legal Professionals Worldwide"
          description="Join thousands of legal professionals who are already transforming their document workflow with LegalBriefAI"
          testimonials={testimonials}
        />
        <AboutSection />
        <FAQSection faqs={faqs} />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
