
export const getPricingPlans = (isAnnual: boolean) => [
  {
    name: "Lifetime Free",
    price: "0",
    period: "",
    description: "Limited trial features",
    originalPrice: "69",
    features: [
      "2 document analyses/month",
      "Basic summaries only",
      "Email support",
      "Standard processing time"
    ],
    highlight: false,
    isRedeemCode: true
  },
  {
    name: "Starter Plan",
    price: isAnnual ? "11.94" : "19.90",
    period: isAnnual ? "/month, billed annually" : "/month",
    description: "Perfect for Solo Practitioners",
    originalPrice: isAnnual ? "19.90" : "33.17",
    discount: "40% OFF",
    features: [
      "25 documents/month",
      "Advanced AI analysis",
      "Risk detection & alerts",
      "Email & chat support",
      "Priority processing",
      "Document export options"
    ],
    highlight: false
  },
  {
    name: "Professional",
    price: isAnnual ? "59.40" : "99.00",
    period: isAnnual ? "/month, billed annually" : "/month",
    description: "For Growing Law Firms",
    originalPrice: isAnnual ? "99.00" : "165.00",
    discount: "40% OFF",
    features: [
      "500 documents/month",
      "Advanced clause analysis & risk detection",
      "Jurisdiction-specific insights",
      "Multi-user access (up to 5 team members)",
      "Advanced Processing & Analytics Dashboard",
      "Priority email & phone support",
      "Beta access to new features"
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
      "Custom AI model training",
      "Batch processing & advanced analytics",
      "White-label solutions",
      "Dedicated account manager & 24/7 support",
      "On-premises deployment options",
      "Full access to all features",
      "Custom integrations & API access"
    ],
    highlight: false
  }
];

export const getAddOns = () => [];
