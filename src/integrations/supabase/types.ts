export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          organization_id: string | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      code_redemptions: {
        Row: {
          code_id: string
          expires_at: string
          id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          code_id: string
          expires_at: string
          id?: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          code_id?: string
          expires_at?: string
          id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_redemptions_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "redemption_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      document_analyses: {
        Row: {
          analysis_status: string | null
          created_at: string
          document_path: string
          id: string
          is_deleted: boolean | null
          organization_id: string | null
          original_name: string
          summary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_status?: string | null
          created_at?: string
          document_path: string
          id?: string
          is_deleted?: boolean | null
          organization_id?: string | null
          original_name: string
          summary?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_status?: string | null
          created_at?: string
          document_path?: string
          id?: string
          is_deleted?: boolean | null
          organization_id?: string | null
          original_name?: string
          summary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          max_members: number | null
          name: string
          owner_id: string
          settings: Json | null
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          max_members?: number | null
          name: string
          owner_id: string
          settings?: Json | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          max_members?: number | null
          name?: string
          owner_id?: string
          settings?: Json | null
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          document_count: number | null
          document_limit: number | null
          email: string
          id: string
          last_login: string | null
          login_history: Json | null
          organization_id: string | null
          role: string | null
          security_settings: Json | null
          source: string | null
          updated_at: string
          username: string
          whop_plan_id: string | null
          whop_subscription_id: string | null
          whop_user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          document_count?: number | null
          document_limit?: number | null
          email: string
          id: string
          last_login?: string | null
          login_history?: Json | null
          organization_id?: string | null
          role?: string | null
          security_settings?: Json | null
          source?: string | null
          updated_at?: string
          username: string
          whop_plan_id?: string | null
          whop_subscription_id?: string | null
          whop_user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          document_count?: number | null
          document_limit?: number | null
          email?: string
          id?: string
          last_login?: string | null
          login_history?: Json | null
          organization_id?: string | null
          role?: string | null
          security_settings?: Json | null
          source?: string | null
          updated_at?: string
          username?: string
          whop_plan_id?: string | null
          whop_subscription_id?: string | null
          whop_user_id?: string | null
        }
        Relationships: []
      }
      redemption_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          duration_days: number
          id: string
          plan_type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          duration_days: number
          id?: string
          plan_type: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          duration_days?: number
          id?: string
          plan_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      signature_fields: {
        Row: {
          assigned_signer_email: string
          field_type: string
          id: string
          position: Json
          request_id: string
          required: boolean
        }
        Insert: {
          assigned_signer_email: string
          field_type: string
          id?: string
          position: Json
          request_id: string
          required?: boolean
        }
        Update: {
          assigned_signer_email?: string
          field_type?: string
          id?: string
          position?: Json
          request_id?: string
          required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "signature_fields_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "signature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_requests: {
        Row: {
          created_at: string
          document_name: string
          document_path: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_name: string
          document_path: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_name?: string
          document_path?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      signatures: {
        Row: {
          field_id: string
          id: string
          ip_address: string | null
          signature_image: string
          signed_at: string
          signer_email: string
          user_agent: string | null
        }
        Insert: {
          field_id: string
          id?: string
          ip_address?: string | null
          signature_image: string
          signed_at?: string
          signer_email: string
          user_agent?: string | null
        }
        Update: {
          field_id?: string
          id?: string
          ip_address?: string | null
          signature_image?: string
          signed_at?: string
          signer_email?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signatures_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "signature_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      signing_sessions: {
        Row: {
          created_at: string
          expires_at: string
          field_id: string
          id: string
          session_token: string
          signed: boolean
          signer_email: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          field_id: string
          id?: string
          session_token: string
          signed?: boolean
          signer_email: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          field_id?: string
          id?: string
          session_token?: string
          signed?: boolean
          signer_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "signing_sessions_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "signature_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_type: Database["public"]["Enums"]["subscription_tier"]
          source: string | null
          status: string
          updated_at: string
          user_id: string
          whop_plan_id: string | null
          whop_subscription_id: string | null
          whop_user_id: string | null
        }
        Insert: {
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          plan_type: Database["public"]["Enums"]["subscription_tier"]
          source?: string | null
          status: string
          updated_at?: string
          user_id: string
          whop_plan_id?: string | null
          whop_subscription_id?: string | null
          whop_user_id?: string | null
        }
        Update: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_type?: Database["public"]["Enums"]["subscription_tier"]
          source?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          whop_plan_id?: string | null
          whop_subscription_id?: string | null
          whop_user_id?: string | null
        }
        Relationships: []
      }
      team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          organization_id: string
          role: string
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by: string
          organization_id: string
          role?: string
          status?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          organization_id?: string
          role?: string
          status?: string
          token?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string
          organization_id: string
          permissions: Json | null
          role: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          organization_id: string
          permissions?: Json | null
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string
          organization_id?: string
          permissions?: Json | null
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          analysis_id: string | null
          created_at: string
          feedback_text: string | null
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string
          feedback_text?: string | null
          id?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_id?: string | null
          created_at?: string
          feedback_text?: string | null
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "document_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      whop_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          status: string
          transaction_type: string
          updated_at: string
          user_id: string
          whop_plan_id: string
          whop_subscription_id: string
          whop_user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          status: string
          transaction_type: string
          updated_at?: string
          user_id: string
          whop_plan_id: string
          whop_subscription_id: string
          whop_user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
          whop_plan_id?: string
          whop_subscription_id?: string
          whop_user_id?: string
        }
        Relationships: []
      }
      whop_webhooks: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          processed: boolean | null
          processed_at: string | null
          whop_plan_id: string | null
          whop_subscription_id: string | null
          whop_user_id: string
        }
        Insert: {
          created_at?: string
          event_data: Json
          event_type: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          whop_plan_id?: string | null
          whop_subscription_id?: string | null
          whop_user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          whop_plan_id?: string | null
          whop_subscription_id?: string | null
          whop_user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organization_with_owner: {
        Args: { org_description?: string; org_name: string }
        Returns: string
      }
      force_update_analysis: {
        Args: { analysis_id: string; new_status: string; new_summary: string }
        Returns: undefined
      }
      get_public_profile: {
        Args: { user_id: string }
        Returns: {
          username: string
        }[]
      }
      log_user_action: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type?: string
        }
        Returns: undefined
      }
      sync_whop_subscription: {
        Args: {
          p_current_period_end: string
          p_current_period_start: string
          p_plan_type: string
          p_status: string
          p_user_id: string
          p_whop_plan_id: string
          p_whop_subscription_id: string
          p_whop_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      subscription_tier:
        | "basic"
        | "professional"
        | "enterprise"
        | "pay_per_document"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      subscription_tier: [
        "basic",
        "professional",
        "enterprise",
        "pay_per_document",
      ],
    },
  },
} as const
