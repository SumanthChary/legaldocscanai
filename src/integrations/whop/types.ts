// Whop-specific types for LegalDeep AI integration

export interface WhopUser {
  id: string;
  email: string;
  username?: string;
  plan_id?: string;
  subscription_id?: string;
  access_pass?: string;
}

export interface WhopSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface WhopWebhookEvent {
  type: 'subscription.created' | 'subscription.updated' | 'subscription.canceled' | 'user.access_granted' | 'user.access_revoked';
  data: {
    user?: WhopUser;
    subscription?: WhopSubscription;
    access_pass?: string;
    plan_id?: string;
  };
  timestamp: string;
}

export interface WhopPlan {
  id: string;
  name: string;
  price: number;
  documents: number;
  isLifetime?: boolean;
  features: string[];
}

export type WhopAuthFlow = {
  state: string;
  redirect_uri: string;
  code_challenge?: string;
  code_challenge_method?: string;
};

export interface WhopApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}