import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Shield, Globe, Scale, Rocket, Search, Users, ChartBar, ArrowRight, Check, HelpCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import { InView } from "@/components/ui/in-view";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText className="h-12 w-12 text-accent" />,
      title: "Document Summarization",
      description: "Extract key points and critical clauses with AI-powered precision"
    },
    {
      icon: <Shield className="h-12 w-12 text-accent" />,
      title: "Security & Privacy",
      description: "End-to-end encryption and regulatory compliance for your documents"
    },
    {
      icon: <Globe className="h-12 w-12 text-accent" />,
      title: "Multi-Language Support",
      description: "Summarize documents across multiple languages with translations"
    },
    {
      icon: <Scale className="h-12 w-12 text-accent" />,
      title: "Compliance Checker",
      description: "Ensure alignment with GDPR, CCPA, and HIPAA regulations"
    },
    {
      icon: <Search className="h-12 w-12 text-accent" />,
      title: "Smart Search",
      description: "Advanced search with plain-language explanations of legal jargon"
    },
    {
      icon: <ChartBar className="h-12 w-12 text-accent" />,
      title: "Analytics Dashboard",
      description: "Comprehensive metrics on time saved and document trends"
    }
  ];

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
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-accent/5">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                  Transform Legal Documents with AI
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                  Streamline your legal workflow with our advanced AI technology. Analyze, summarize, and extract insights from complex legal documents in minutes.
                </p>
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="text-base md:text-lg px-6 md:px-8"
                    onClick={() => navigate("/dashboard")}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base md:text-lg px-6 md:px-8"
                    onClick={() => navigate("/document-analysis")}
                  >
                    Learn More
                  </Button>
                </div>
                <div className="pt-6">
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <Check className="h-5 w-5 text-success" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-xl">
                  <div className="space-y-6">
                    <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-10 bg-accent/20 rounded-lg w-1/3 animate-pulse"></div>
                      <div className="h-10 bg-gray-100 rounded-lg w-1/3 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Powerful Features for Legal Professionals
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI-powered platform provides comprehensive tools for efficient legal document analysis
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-accent/50"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <TestimonialsSection
          title="Trusted by Legal Professionals Worldwide"
          description="Join thousands of legal professionals who are already transforming their document workflow with LegalBriefAI"
          testimonials={testimonials}
        />

        {/* About Us Section */}
        <div className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <InView
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewOptions={{ margin: "0px 0px -100px 0px" }}
            >
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">About Us</h2>
                <p className="text-lg text-gray-600 mb-8">
                  LegalBriefAI was founded with a vision to revolutionize legal document analysis through artificial intelligence. Our team of legal professionals and AI experts work together to create innovative solutions that make legal work more efficient and accurate.
                </p>
                <p className="text-lg text-gray-600">
                  We understand the challenges legal professionals face when dealing with vast amounts of documentation. That's why we've developed a platform that combines cutting-edge AI technology with user-friendly interfaces to streamline your workflow and enhance productivity.
                </p>
              </div>
            </InView>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-white border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2 text-left">
                        <HelpCircle className="h-5 w-5 text-accent flex-shrink-0" />
                        <span className="text-lg font-semibold">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Legal Document Workflow?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of legal professionals who trust our AI-powered solution
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="text-lg px-8 bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/dashboard")}
            >
              Start Free Trial
              <Users className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
