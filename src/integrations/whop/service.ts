import { whopClient, WHOP_CONFIG } from './client';
import { supabase } from '@/integrations/supabase/client';
import type { WhopUser, WhopApiResponse } from './types';

export class WhopService {
  /**
   * Verify Whop user access for the app
   */
  static async verifyUserAccess(userId: string): Promise<WhopApiResponse<boolean>> {
    try {
      const response = await whopClient.validateLicense({
        userId,
        appId: WHOP_CONFIG.APP_ID,
      });
      
      return {
        success: true,
        data: response.valid || false
      };
    } catch (error) {
      console.error('Whop user verification failed:', error);
      return {
        success: false,
        error: {
          message: 'Failed to verify user access',
          code: 'VERIFICATION_FAILED'
        }
      };
    }
  }

  /**
   * Get Whop user information
   */
  static async getUser(userId: string): Promise<WhopApiResponse<WhopUser>> {
    try {
      const user = await whopClient.users.retrieve(userId);
      
      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          plan_id: user.access_pass?.plan_id,
          subscription_id: user.access_pass?.id,
          access_pass: user.access_pass?.id
        }
      };
    } catch (error) {
      console.error('Failed to get Whop user:', error);
      return {
        success: false,
        error: {
          message: 'Failed to retrieve user data',
          code: 'USER_FETCH_FAILED'
        }
      };
    }
  }

  /**
   * Sync Whop user with local Supabase profile
   */
  static async syncUserProfile(whopUserId: string, supabaseUserId: string): Promise<WhopApiResponse<void>> {
    try {
      const userResponse = await this.getUser(whopUserId);
      
      if (!userResponse.success || !userResponse.data) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch Whop user data',
            code: 'SYNC_FAILED'
          }
        };
      }

      const whopUser = userResponse.data;
      
      // Update Supabase profile with Whop data
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: supabaseUserId,
          username: whopUser.username || whopUser.email.split('@')[0],
          email: whopUser.email,
          // Note: We'll add whop columns to profiles table in Phase 2
        });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Profile sync failed:', error);
      return {
        success: false,
        error: {
          message: 'Failed to sync user profile',
          code: 'PROFILE_SYNC_FAILED'
        }
      };
    }
  }

  /**
   * Check if current request is from Whop
   */
  static isWhopUser(): boolean {
    if (typeof window === 'undefined') return false;
    
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    
    return urlParams.has('whop') || 
           urlParams.has('access_pass') || 
           referrer.includes('whop.com');
  }

  /**
   * Redirect to Whop checkout for a specific plan
   */
  static redirectToWhopCheckout(planId: string): void {
    const checkoutUrl = `https://whop.com/checkout/${planId}?app_id=${WHOP_CONFIG.APP_ID}`;
    window.location.href = checkoutUrl;
  }
}