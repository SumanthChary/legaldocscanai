
import { FileText, Shield, Globe, Scale, Search, ChartBar } from "lucide-react";

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

export const featuresData: Feature[] = [
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

export const FeaturesSection = () => {
  return (
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
          {featuresData.map((feature, index) => (
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
  );
};
