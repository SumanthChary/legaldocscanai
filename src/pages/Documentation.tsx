import { PageLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Code, FileText, Info, Play, Shield, FileCheck, Pen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DocumentationSection = ({ 
  title, 
  description, 
  icon: Icon, 
  children
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  children?: React.ReactNode;
}) => (
  <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
    {children}
  </Card>
);

const Documentation = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">LegalDeep AI Documentation</h1>
          <p className="text-muted-foreground text-center mb-12">
            Everything you need to know about using our platform
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <DocumentationSection
              title="Getting Started"
              description="Learn the basics of LegalDeep AI and how to use its core features."
              icon={Play}
            >
              <Button variant="link" className="p-0" onClick={() => navigate("/documentation/getting-started")}>
                Read guide →
              </Button>
            </DocumentationSection>

            <DocumentationSection
              title="AI Document Analysis"
              description="Understand how our AI analyzes legal documents and provides insights."
              icon={FileText}
            >
              <Button variant="link" className="p-0" onClick={() => navigate("/document-analysis")}>
                Try it now →
              </Button>
            </DocumentationSection>

            <DocumentationSection
              title="Compliance Features"
              description="Learn how to use our compliance checking tools for various regulations."
              icon={Shield}
            >
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </DocumentationSection>

            <DocumentationSection
              title="E-Signature Integration"
              description="Securely sign and share legal documents with integrated e-signature."
              icon={FileCheck}
            >
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </DocumentationSection>

            <DocumentationSection
              title="Document Templates"
              description="Create customized legal documents using our template library."
              icon={Pen}
            >
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </DocumentationSection>

            <DocumentationSection
              title="API Reference"
              description="Technical documentation for developers integrating with our platform."
              icon={Code}
            >
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </DocumentationSection>
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">How accurate is the AI analysis?</h4>
                <p className="text-muted-foreground">Our AI maintains a high accuracy rate in document analysis and summary generation. However, we recommend using it as a supportive tool alongside professional legal judgment.</p>
              </div>

              <div>
                <h4 className="font-medium">Is my data secure?</h4>
                <p className="text-muted-foreground">We prioritize your data security with end-to-end encryption and compliance with major privacy regulations. All documents are stored securely with strict access controls.</p>
              </div>

              <div>
                <h4 className="font-medium">What document types are supported?</h4>
                <p className="text-muted-foreground">We support PDF, DOCX, and TXT formats for legal document analysis.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Documentation;
