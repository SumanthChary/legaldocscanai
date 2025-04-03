
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileCheck, FileText, Shield, FileSignature, Component } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Feature = ({ 
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

const UpcomingFeatures = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h1 className="text-3xl font-bold mb-4">New Legal AI Features Coming Soon</h1>
            <p className="text-lg text-muted-foreground">
              We're constantly enhancing our platform with innovative AI tools designed specifically for legal professionals.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <Feature 
              icon={FileText}
              title="AI Contract Analyzer"
              description="Deep analysis of legal contracts with risk assessment"
              status="beta"
              infoList={[
                "Upload contracts (PDF, DOCX, TXT)",
                "AI scans and extracts key clauses and risks",
                "Highlights missing terms and obligations",
                "Provides easy-to-understand summaries"
              ]}
            />
            
            <Feature 
              icon={FileSignature}
              title="E-Signature Integration"
              description="Secure digital signatures for your legal documents"
              status="coming-soon"
              infoList={[
                "Upload AI-generated or existing legal documents",
                "Add signature fields for multiple parties",
                "Secure digital signing process",
                "Tamper-proof document storage and download"
              ]}
            />
            
            <Feature 
              icon={Shield}
              title="Legal Compliance Checker"
              description="Ensure your documents comply with relevant regulations"
              status="coming-soon"
              infoList={[
                "Upload legal documents for compliance review",
                "AI checks against GDPR, CCPA, and other regulations",
                "Flags violations and missing clauses",
                "Provides remediation suggestions"
              ]}
            />
            
            <Feature 
              icon={Component}
              title="Customizable Document Templates"
              description="Create legal documents with customizable templates"
              status="coming-soon"
              infoList={[
                "Access library of pre-made legal templates",
                "Customize with your specific requirements",
                "AI helps fill in appropriate clauses",
                "Export documents in multiple formats"
              ]}
            />
          </div>
          
          <div className="text-center">
            <Button size="lg" onClick={() => navigate("/")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpcomingFeatures;
