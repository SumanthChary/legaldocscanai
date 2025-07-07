export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
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
          original_name?: string
          summary?: string | null
          updated_at?: string
          user_id?: string
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
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          document_count?: number | null
          document_limit?: number | null
          email: string
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          document_count?: number | null
          document_limit?: number | null
          email?: string
          id?: string
          updated_at?: string
          username?: string
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
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          plan_type: Database["public"]["Enums"]["subscription_tier"]
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_type?: Database["public"]["Enums"]["subscription_tier"]
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      force_update_analysis: {
        Args: { analysis_id: string; new_summary: string; new_status: string }
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
