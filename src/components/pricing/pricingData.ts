
export const getPricingPlans = (isAnnual: boolean) => [
  {
    name: "Free Trial",
    price: "0",
    period: "",
    description: "Perfect for trying our platform",
    features: [
      "3 free document analyses",
      "Basic document summarization",
      "Risk identification highlights",
      "Email support within 48 hours",
      "Standard processing (2-5 minutes)",
      "PDF and Word document support",
      "Basic contract templates"
    ],
    highlight: false
  },
  {
    name: "Starter",
    price: isAnnual ? "15" : "25",
    period: isAnnual ? "/month (billed annually)" : "/month",
    description: "Ideal for solo practitioners and small teams",
    features: [
      "25 document analyses per month",
      "Advanced clause highlights & risk detection",
      "Jurisdiction-specific legal insights",
      "Priority email support (24-hour response)",
      "Fast processing (under 2 minutes)",
      "Document comparison tools",
      "Basic analytics dashboard",
      "Contract templates library (50+ templates)",
      "Export to PDF, Word, and PowerPoint"
    ],
    highlight: false
  },
  {
    name: "Professional",
    price: isAnnual ? "79" : "132",
    period: isAnnual ? "/month (billed annually)" : "/month",
    description: "Built for growing law firms and departments",
    features: [
      "500 document analyses per month",
      "Advanced risk scoring and insights",
      "Multi-jurisdiction compliance checks",
      "Priority support with dedicated success manager",
      "Lightning-fast processing (under 1 minute)",
      "Team collaboration features",
      "Advanced analytics and reporting",
      "Custom contract templates and clauses",
      "API access for integrations",
      "White-label options available",
      "Beta access to new AI features",
      "Bulk document processing"
    ],
    highlight: true,
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for large organizations",
    features: [
      "Unlimited document analyses",
      "Custom AI model training for your use case",
      "Advanced batch processing and workflow automation",
      "Dedicated account manager and 24/7 phone support",
      "On-premises or private cloud deployment",
      "Advanced security and compliance (SOC 2, HIPAA)",
      "Custom integrations with your existing tools",
      "Comprehensive analytics and business intelligence",
      "Priority feature development and roadmap input",
      "Training and onboarding for your entire team",
      "SLA guarantees and uptime commitments",
      "Custom contract review workflows"
    ],
    highlight: false
  }
];

export const getAddOns = () => [];
