import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Shield, 
  Users, 
  Cloud, 
  Headphones,
  Server
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Document Processing",
      description: "Process from 50 to unlimited documents per month based on your plan",
      icon: FileText,
      details: [
        "Smart document summarization",
        "Batch processing capabilities",
        "Support for multiple file formats"
      ]
    },
    {
      title: "Analysis Tools",
      description: "Advanced clause analysis and risk detection systems",
      icon: Shield,
      details: [
        "Basic to advanced clause analysis",
        "Risk detection and assessment",
        "Jurisdiction-specific insights"
      ]
    },
    {
      title: "Collaboration",
      description: "Team features for seamless workflow",
      icon: Users,
      details: [
        "Multi-user access",
        "Real-time collaboration",
        "Comments and annotations"
      ]
    },
    {
      title: "Cloud Integration",
      description: "Connect with your favorite cloud storage solutions",
      icon: Cloud,
      details: [
        "Google Drive integration",
        "Dropbox support",
        "Secure file handling"
      ]
    },
    {
      title: "Support Options",
      description: "Comprehensive support across all plans",
      icon: Headphones,
      details: [
        "Email support",
        "Priority support",
        "24/7 dedicated support"
      ]
    },
    {
      title: "Enterprise Solutions",
      description: "Advanced features for large organizations",
      icon: Server,
      details: [
        "On-premises deployment",
        "Private cloud options",
        "Custom security policies"
      ]
    }
  ];

  return (
    <PageLayout>
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Legal Document Analysis
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From basic document processing to advanced AI-powered analysis, 
              we provide the tools you need to streamline your legal workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:border-blue-500 transition-all"
              >
                <feature.icon className="h-12 w-12 text-blue-500 mb-6" />
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.details.map((detail) => (
                    <li key={detail} className="text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => navigate("/pricing")}
              className="px-8"
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Features;
