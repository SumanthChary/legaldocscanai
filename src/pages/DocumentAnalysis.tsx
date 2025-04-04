import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Brain, Zap, Clock, Shield, Users } from "lucide-react";

const DocumentAnalysis = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-accent" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze documents with human-like understanding"
    },
    {
      icon: <Zap className="h-8 w-8 text-accent" />,
      title: "Instant Processing",
      description: "Get comprehensive analysis results in seconds, not hours"
    },
    {
      icon: <Clock className="h-8 w-8 text-accent" />,
      title: "Time Savings",
      description: "Reduce document review time by up to 75% with automated analysis"
    },
    {
      icon: <Shield className="h-8 w-8 text-accent" />,
      title: "Security First",
      description: "Enterprise-grade encryption and security for your sensitive documents"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Documents",
      description: "Drag and drop your legal documents or select files from your computer"
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our AI engine processes and analyzes your documents in real-time"
    },
    {
      number: "03",
      title: "Review Insights",
      description: "Get detailed summaries, key points, and actionable insights"
    }
  ];

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-primary/5 to-accent/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Advanced Document Analysis
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Transform complex legal documents into clear, actionable insights with our AI-powered analysis tools
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="px-8"
            >
              Try It Now
              <FileText className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-block bg-accent/10 rounded-full p-4 mb-4">
                  <span className="text-2xl font-bold text-accent">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Start Analyzing Your Documents Today
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of legal professionals who trust our platform
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/dashboard")}
            >
              Get Started
              <Users className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/pricing")}
            >
              View Pricing
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DocumentAnalysis;
