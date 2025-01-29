import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Shield, Globe, Scale, Rocket, Search, Users, ChartBar } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 z-0" />
          <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6">
                AI-Powered Legal Document Analysis
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-4">
                Transform complex legal documents into clear, actionable insights with our advanced AI technology
              </p>
              <Button
                size="lg"
                className="text-base md:text-lg px-6 md:px-8"
                onClick={() => navigate("/dashboard")}
              >
                Get Started
                <Rocket className="ml-2 h-4 md:h-5 w-4 md:w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-12 md:mb-16">
              Powerful Features for Legal Professionals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 md:p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg md:text-xl font-semibold text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-white py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              Ready to Transform Your Legal Document Workflow?
            </h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90 px-4">
              Join thousands of legal professionals who trust our AI-powered solution
            </p>
            <Button
              variant="outline"
              size="lg"
              className="text-base md:text-lg px-6 md:px-8 bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/dashboard")}
            >
              Start Free Trial
              <Users className="ml-2 h-4 md:h-5 w-4 md:w-5" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;