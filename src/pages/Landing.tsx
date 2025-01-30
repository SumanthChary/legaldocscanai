import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Shield, Globe, Scale, Rocket, Search, Users, ChartBar, ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

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