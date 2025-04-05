
export const getPricingPlans = (isAnnual: boolean) => [
  {
    name: "Free",
    price: "0",
    period: "",
    description: "Try it out first",
    features: [
      "3 free document analyses",
      "Basic document summarization",
      "Email support",
      "Standard processing time"
    ],
    highlight: false
  },
  {
    name: "Basic",
    price: isAnnual ? "16" : "20",
    period: isAnnual ? "/month, billed annually" : "/month",
    description: "For Individual Users",
    features: [
      "Summarize up to 25 documents/month",
      "Basic clause analysis",
      "Email support",
      "Standard processing time",
      "Basic document templates"
    ],
    highlight: false
  },
  {
    name: "Professional",
    price: isAnnual ? "79" : "99",
    period: isAnnual ? "/month, billed annually" : "/month",
    description: "For Small to Mid-Size Firms",
    features: [
      "Summarize up to 500 documents/month",
      "Advanced clause analysis and risk detection",
      "Jurisdiction-specific insights",
      "Multi-user access (up to 5 team members)",
      "Real-time collaboration tools",
      "Priority email support",
      "Beta access to select new features"
    ],
    highlight: true,
    popular: true
  },
  {
    name: "Enterprise",
    price: "399",
    period: "/month",
    description: "For Large Firms and Enterprises",
    features: [
      "Unlimited document summarization",
      "AI fine-tuning for firm-specific needs",
      "Batch processing and advanced analytics",
      "Integration with legal software",
      "Dedicated account manager and 24/7 support",
      "On-premises or private cloud option",
      "Full access to all beta features",
      "Exclusive roadmap visibility and input"
    ],
    highlight: false
  },
  {
    name: "Pay-Per-Document",
    price: "10",
    period: "/document",
    description: "Flexible for Low-Volume Users",
    features: [
      "Full access to summarization tools",
      "Complete analysis features",
      "Pay as you go pricing",
      "No monthly commitment",
      "Discounted bundles available"
    ],
    highlight: false
  }
];

export const getAddOns = () => [
  {
    name: "Additional Users",
    price: "$20/user/month",
    description: "Beyond plan limit"
  },
  {
    name: "API Access",
    price: "$199/month",
    description: "Plus usage-based pricing"
  },
  {
    name: "Custom Model Training",
    price: "From $1,000",
    description: "One-time setup fee"
  }
];
