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
import { BetaProgram } from "@/components/features/BetaProgram";
import { FeatureHighlight } from "@/components/features/FeatureHighlight";
import { PreviewFeatures } from "@/components/features/PreviewFeatures";

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
      title: "AI Contract Analyzer",
      description: "Deep analysis of legal contracts with risk assessment",
      status: "beta" as const,
      infoList: [
        "Upload contracts (PDF, DOCX, TXT)",
        "AI scans and extracts key clauses and risks",
        "Highlights missing terms and obligations",
        "Provides easy-to-understand summaries"
      ]
    },
    {
      icon: Shield,
      title: "Legal Compliance Checker",
      description: "Ensure your documents comply with relevant regulations",
      status: "coming-soon" as const,
      infoList: [
        "Upload legal documents for compliance review",
        "AI checks against GDPR, CCPA, and other regulations",
        "Flags violations and missing clauses",
        "Provides remediation suggestions"
      ]
    },
    {
      icon: Component,
      title: "Customizable Document Templates",
      description: "Create legal documents with customizable templates",
      status: "coming-soon" as const,
      infoList: [
        "Access library of pre-made legal templates",
        "Customize with your specific requirements",
        "AI helps fill in appropriate clauses",
        "Export documents in multiple formats"
      ]
    }
  ];

  const previewFeatures = [
    {
      icon: Languages,
      title: "Advanced Language Processing",
      description: "Sophisticated language capabilities coming to our platform",
      status: "coming-soon" as const,
      infoList: []
    },
    {
      icon: Clock,
      title: "Visual Analytics Suite",
      description: "Transform complex legal information into visual insights",
      status: "coming-soon" as const,
      infoList: []
    },
    {
      icon: Users2,
      title: "Enhanced Collaboration Tools",
      description: "Next-generation team workflows for legal professionals",
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
          <BetaProgram />
          
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
          
          <div className="text-center">
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
