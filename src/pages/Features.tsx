
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
  Timeline,
  Link,
  Users2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const UpcomingFeature = ({ 
  icon: Icon, 
  title, 
  description, 
  status, 
  infoList,
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  status: "available" | "coming-soon" | "beta";
  infoList: string[];
}) => {
  const statusColors = {
    "available": "bg-green-100 text-green-700",
    "coming-soon": "bg-amber-100 text-amber-700",
    "beta": "bg-blue-100 text-blue-700"
  };
  
  const statusLabels = {
    "available": "Available Now",
    "coming-soon": "Coming Soon",
    "beta": "Beta Access"
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="text-sm font-medium mb-2">How It Works:</h4>
        <ul className="space-y-2">
          {infoList.map((info, index) => (
            <li key={index} className="flex items-start text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
              <span>{info}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

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
  
  const upcomingFeatures = [
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
      icon: FileSignature,
      title: "E-Signature Integration",
      description: "Secure digital signatures for your legal documents",
      status: "coming-soon" as const,
      infoList: [
        "Upload AI-generated or existing legal documents",
        "Add signature fields for multiple parties",
        "Secure digital signing process",
        "Tamper-proof document storage and download"
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
    },
    {
      icon: Languages,
      title: "Multilingual Legal Document Summarization",
      description: "AI-powered summarization across multiple languages",
      status: "coming-soon" as const,
      infoList: [
        "Support for English, Spanish, French, and more",
        "Accurate legal terminology across languages",
        "Maintain legal meaning in translations",
        "Perfect for global law firms and multinational corporations"
      ]
    },
    {
      icon: Database,
      title: "Meta-Summarization for Long Documents",
      description: "Hierarchical summaries for lengthy documents",
      status: "coming-soon" as const,
      infoList: [
        "Chapter-level or clause-level summaries",
        "Maintains context across large documents",
        "Ideal for litigation teams handling discovery",
        "Navigate complex contracts without losing details"
      ]
    },
    {
      icon: Shield,
      title: "Clause Extraction and Comparative Analysis",
      description: "Extract and compare clauses across multiple agreements",
      status: "coming-soon" as const,
      infoList: [
        "Automatically identify specific clause types",
        "Side-by-side comparison of similar contracts",
        "Identify discrepancies and potential issues",
        "Save time reviewing similar agreements"
      ]
    },
    {
      icon: Timeline,
      title: "Interactive Summaries with Visualizations",
      description: "Transform summaries into interactive charts and timelines",
      status: "coming-soon" as const,
      infoList: [
        "Visual representation of case progression",
        "Contract obligation timelines",
        "Exportable charts and graphs",
        "Make complex information more accessible"
      ]
    },
    {
      icon: Users2,
      title: "Real-Time Collaboration on Summaries",
      description: "Simultaneous editing and annotation by multiple users",
      status: "coming-soon" as const,
      infoList: [
        "Multiple users edit in real-time",
        "Track changes and contributions",
        "Comment and annotation features",
        "Perfect for distributed legal teams"
      ]
    },
    {
      icon: Link,
      title: "Integration with Legal Research Databases",
      description: "Link summarized content to relevant case law or statutes",
      status: "coming-soon" as const,
      infoList: [
        "One-click access to supporting legal materials",
        "Automated citation suggestions",
        "Integration with major legal research platforms",
        "Save time on additional research"
      ]
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

          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-lg text-muted-foreground">
              We're constantly enhancing our platform with innovative AI tools designed specifically for legal professionals.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            {upcomingFeatures.map((feature, index) => (
              <UpcomingFeature 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                status={feature.status}
                infoList={feature.infoList}
              />
            ))}
          </div>
          
          <div className="text-center">
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
