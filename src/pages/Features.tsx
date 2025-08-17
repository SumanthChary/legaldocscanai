import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Shield, 
  Users, 
  Cloud, 
  Headphones,
  Server,
  FileSignature,
  Component,
  Database,
  Languages,
  Clock,
  Link,
  Users2,
  Sparkles,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainFeatures } from "@/components/features/MainFeatures";

import { FeatureHighlight } from "@/components/features/FeatureHighlight";
import { PreviewFeatures } from "@/components/features/PreviewFeatures";
import { WaitlistForm } from "@/components/features/WaitlistForm";

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
  
  const highlightedUpcomingFeatures = [
    {
      icon: FileText,
      title: "Enhanced Document Processing",
      description: "Advanced analysis capabilities for legal documents",
      status: "beta" as const,
      infoList: [
        "Improved document scanning",
        "Enhanced clause detection",
        "Better risk assessment",
        "Streamlined workflow integration"
      ]
    },
    {
      icon: Shield,
      title: "Compliance Management",
      description: "Tools to help ensure regulatory compliance",
      status: "coming-soon" as const,
      infoList: [
        "Regulatory compliance checking",
        "Policy alignment verification",
        "Automated compliance reporting",
        "Risk mitigation suggestions"
      ]
    },
    {
      icon: Component,
      title: "Document Automation",
      description: "Streamlined document creation and management",
      status: "coming-soon" as const,
      infoList: [
        "Template management system",
        "Automated document generation",
        "Custom workflow creation",
        "Integration capabilities"
      ]
    }
  ];

  const previewFeatures = [
    {
      icon: Languages,
      title: "Advanced Processing",
      description: "Enhanced capabilities for document analysis",
      status: "coming-soon" as const,
      infoList: []
    },
    {
      icon: Clock,
      title: "Analytics Dashboard",
      description: "Comprehensive insights and reporting tools",
      status: "coming-soon" as const,
      infoList: []
    },
    {
      icon: Users2,
      title: "Team Collaboration",
      description: "Enhanced workflow tools for teams",
      status: "coming-soon" as const,
      infoList: []
    }
  ];

  return (
    <PageLayout>
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Legal Document Analysis
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From basic document processing to advanced AI-powered analysis, 
              we provide the tools you need to streamline your legal workflow
            </p>
          </div>

          <MainFeatures features={features} />
          
          <FeatureHighlight
            title="Key Upcoming Features"
            description="Get a glimpse of the innovations we're developing to enhance your legal workflow"
            features={highlightedUpcomingFeatures}
            showEnterpriseTip={true}
          />
          
          <PreviewFeatures
            title="More Innovations in Development"
            description="A preview of additional capabilities on our roadmap"
            features={previewFeatures}
          />
          
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Be First to Know About New Features
            </h2>
            <p className="mb-6 text-gray-600 max-w-2xl mx-auto">
              Join our waitlist to get early access to upcoming features and exclusive updates about LegalDeep AI innovations.
            </p>
            <WaitlistForm />
          </div>
          
          <div className="text-center mt-8">
            <p className="mb-6 text-gray-600">
              Ready to experience our powerful document analysis capabilities?
            </p>
            <Button size="lg" onClick={() => navigate("/pricing")}>
              View Pricing Plans
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Features;

// File is now over 213 lines; consider refactoring into smaller components soon.
