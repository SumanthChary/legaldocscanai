
export const getPricingPlans = (isAnnual: boolean) => [
  {
    name: "Free",
    price: "0",
    period: "",
    description: "7-day free trial with limits",
    features: [
      "3 free document analyses",
      "Basic document summarization",
      "Email support",
      "Standard processing time"
    ],
    highlight: false
  },
  {
    name: "Starter Plan",
    price: "19",
    period: isAnnual ? "/month, billed annually" : "/month",
    description: "For Individual Users",
    features: [
      "Summarize up to 25 documents/month",
      "Clause highlights & risk hints",
      "Email support",
      "Standard processing time",
      "Starter templates"
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
      "Advanced risk detection & insights",
      "Jurisdiction-specific hints",
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
      "Dedicated account manager and 24/7 support",
      "On-premises or private cloud option",
      "Exclusive roadmap visibility and input"
    ],
    highlight: false
  }
];

export const getAddOns = () => [];
