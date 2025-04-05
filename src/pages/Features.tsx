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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

const UpcomingFeature = ({ 
  icon: Icon, 
  title, 
  description, 
  status, 
  infoList,
  isPreview = false
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  status: "available" | "coming-soon" | "beta";
  infoList: string[];
  isPreview?: boolean;
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
    <Card className={isPreview ? "hover:shadow-md transition-shadow" : ""}>
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
        {isPreview ? (
          <p className="text-sm text-muted-foreground">
            More details available in our beta program or for enterprise customers.
          </p>
        ) : (
          <>
            <h4 className="text-sm font-medium mb-2">How It Works:</h4>
            <ul className="space-y-2">
              {infoList.map((info, index) => (
                <li key={index} className="flex items-start text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const Features = () => {
  const navigate = useNavigate();
  const [showBetaForm, setShowBetaForm] = useState(false);
  const [email, setEmail] = useState("");
  const [betaFeatureInterest, setBetaFeatureInterest] = useState("");

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

  const handleBetaSignup = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please provide your email address to join the beta waitlist.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Beta signup:", { email, featureInterest: betaFeatureInterest });
    
    toast({
      title: "Beta Access Request Received",
      description: "Thank you for your interest! We'll be in touch with more details about our beta program.",
    });
    
    setShowBetaForm(false);
    setEmail("");
    setBetaFeatureInterest("");
  };

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

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl shadow-sm mb-16">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <Sparkles className="h-6 w-6 text-blue-500 mr-2" />
                  Exclusive Beta Program
                </h2>
                <p className="text-gray-700">
                  Get early access to our most innovative features before they're publicly available.
                  Join our beta program to help shape the future of legal document analysis.
                </p>
              </div>
              <Sheet open={showBetaForm} onOpenChange={setShowBetaForm}>
                <SheetTrigger asChild>
                  <Button size="lg" className="shrink-0">
                    Join Beta Waitlist
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Join Our Beta Program</SheetTitle>
                    <SheetDescription>
                      Get early access to our upcoming features and help shape the future of legal document analysis.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="email" className="text-sm font-medium block mb-2">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="feature-interest" className="text-sm font-medium block mb-2">
                        Which feature are you most interested in?
                      </label>
                      <select
                        id="feature-interest"
                        value={betaFeatureInterest}
                        onChange={(e) => setBetaFeatureInterest(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select a feature</option>
                        <option value="AI Contract Analyzer">AI Contract Analyzer</option>
                        <option value="Legal Compliance Checker">Legal Compliance Checker</option>
                        <option value="Multilingual Support">Advanced Language Processing</option>
                        <option value="Visual Analytics">Visual Analytics Suite</option>
                        <option value="Collaboration Tools">Enhanced Collaboration Tools</option>
                      </select>
                    </div>
                    <Button 
                      onClick={handleBetaSignup} 
                      className="w-full mt-4"
                    >
                      Submit
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h2 className="text-3xl font-bold">Key Upcoming Features</h2>
              <div className="relative">
                <Eye className="h-5 w-5 text-blue-500 cursor-pointer hover:text-blue-700" />
                <div className="absolute -top-10 right-0 bg-black text-white text-xs p-2 rounded w-40 opacity-0 group-hover:opacity-100 pointer-events-none">
                  Enterprise customers see our full roadmap
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              Get a glimpse of the innovations we're developing to enhance your legal workflow
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            {highlightedUpcomingFeatures.map((feature, index) => (
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
          
          <div className="max-w-3xl mx-auto mb-6 text-center">
            <h2 className="text-2xl font-bold mb-4">More Innovations in Development</h2>
            <p className="text-muted-foreground">
              A preview of additional capabilities on our roadmap
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {previewFeatures.map((feature, index) => (
              <UpcomingFeature 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                status={feature.status}
                infoList={feature.infoList}
                isPreview={true}
              />
            ))}
          </div>
          
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
