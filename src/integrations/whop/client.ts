// Whop SDK client configuration
// Note: We'll implement the actual SDK calls via fetch for now
// since the official SDK structure may vary

export const WHOP_BASE_URL = 'https://api.whop.com/v2';
export const WHOP_API_KEY = "wJg81bggT-d4D72H5XLNjy0IRAvVVFd8f08EgfKlAhI";

// Whop API client wrapper
export const whopClient = {
  async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${WHOP_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${WHOP_API_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Whop API error: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  users: {
    async retrieve(userId: string) {
      return this.makeRequest(`/users/${userId}`);
    }
  },
  
  async validateLicense({ userId, appId }: { userId: string; appId: string }) {
    return this.makeRequest(`/apps/${appId}/users/${userId}/validate`);
  }
};

// Whop configuration constants
export const WHOP_CONFIG = {
  APP_ID: "app_rHoiRudxInaWO5",
  AGENT_USER_ID: "user_fnVZQ9QZPRBs7",
  COMPANY_ID: "biz_g85KijQsfeTdLw",
  INSTALL_URL: "https://whop.com/apps/app_rHoiRudxInaWO5/install/",
};

// Whop plan configuration for LegalDeep AI
export const WHOP_PLANS = {
  ENTREPRENEUR_SHIELD: {
    id: "entrepreneur_shield",
    name: "Entrepreneur Shield",
    price: 19,
    documents: 15,
    features: [
      "15 document analyses",
      "Basic risk detection", 
      "Contract templates library",
      "Email support"
    ]
  },
  BUSINESS_GUARDIAN: {
    id: "business_guardian", 
    name: "Business Guardian",
    price: 49,
    documents: 100,
    features: [
      "100 document analyses",
      "Advanced risk scoring",
      "Multi-jurisdiction compliance", 
      "Priority support",
      "Document comparison tools"
    ]
  },
  LEGAL_COMMAND_CENTER: {
    id: "legal_command_center",
    name: "Legal Command Center", 
    price: 149,
    documents: 500,
    features: [
      "500 document analyses",
      "Custom AI training",
      "Bulk processing",
      "White-label reports",
      "Dedicated success manager"
    ]
  },
  LIFETIME_POWER_PACK: {
    id: "lifetime_power_pack",
    name: "Lifetime Power Pack",
    price: 297,
    documents: 200,
    isLifetime: true,
    features: [
      "200 lifetime analyses",
      "All Pro features for 2 years",
      "Lifetime access guarantee"
    ]
  }
};