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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action_type: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          admin_user_id: string
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean
          last_activity: string
          session_token: string
          session_token_hash: string | null
          user_agent: string | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_activity?: string
          session_token: string
          session_token_hash?: string | null
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_activity?: string
          session_token?: string
          session_token_hash?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_boosted: boolean | null
          is_reported_by_author: boolean | null
          likes: number | null
          parent_comment_id: string | null
          post_id: string | null
          report_reason: string | null
          report_status: string | null
          reported_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_boosted?: boolean | null
          is_reported_by_author?: boolean | null
          likes?: number | null
          parent_comment_id?: string | null
          post_id?: string | null
          report_reason?: string | null
          report_status?: string | null
          reported_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_boosted?: boolean | null
          is_reported_by_author?: boolean | null
          likes?: number | null
          parent_comment_id?: string | null
          post_id?: string | null
          report_reason?: string | null
          report_status?: string | null
          reported_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_reports: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          post_id: string
          report_details: string | null
          report_reason: string
          reporter_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          post_id: string
          report_details?: string | null
          report_reason: string
          reporter_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          post_id?: string
          report_details?: string | null
          report_reason?: string
          reporter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      home_media: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          id: string
          media_type: string
          step_number: number
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          media_type: string
          step_number: number
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          media_type?: string
          step_number?: number
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      moderated_content: {
        Row: {
          action_taken: string
          classification: string
          content: string
          created_at: string
          id: string
          reason: string
          related_post_id: string | null
          strike_level: number
          user_id: string
        }
        Insert: {
          action_taken: string
          classification: string
          content: string
          created_at?: string
          id?: string
          reason: string
          related_post_id?: string | null
          strike_level: number
          user_id: string
        }
        Update: {
          action_taken?: string
          classification?: string
          content?: string
          created_at?: string
          id?: string
          reason?: string
          related_post_id?: string | null
          strike_level?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderated_content_related_post_id_fkey"
            columns: ["related_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_fee: number | null
          amount: number | null
          created_at: string
          currency: string | null
          id: string
          post_id: string | null
          prize_pool: number | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_fee?: number | null
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          post_id?: string | null
          prize_pool?: number | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_fee?: number | null
          amount?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          post_id?: string | null
          prize_pool?: number | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_images: {
        Row: {
          created_at: string
          id: string
          image_type: string | null
          image_url: string
          post_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_type?: string | null
          image_url: string
          post_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_type?: string | null
          image_url?: string
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_images_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          contest_completed: boolean | null
          created_at: string
          current_entries: number | null
          description: string
          end_date: string
          extension_count: number | null
          extension_reason: string | null
          full_description: string | null
          id: string
          max_entries: number | null
          min_entries_threshold: number | null
          original_end_date: string | null
          prize_pool: number
          product_link: string | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
          winners_selected_at: string | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          contest_completed?: boolean | null
          created_at?: string
          current_entries?: number | null
          description: string
          end_date: string
          extension_count?: number | null
          extension_reason?: string | null
          full_description?: string | null
          id?: string
          max_entries?: number | null
          min_entries_threshold?: number | null
          original_end_date?: string | null
          prize_pool: number
          product_link?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
          winners_selected_at?: string | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          contest_completed?: boolean | null
          created_at?: string
          current_entries?: number | null
          description?: string
          end_date?: string
          extension_count?: number | null
          extension_reason?: string | null
          full_description?: string | null
          id?: string
          max_entries?: number | null
          min_entries_threshold?: number | null
          original_end_date?: string | null
          prize_pool?: number
          product_link?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          winners_selected_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string | null
          id: string
          last_name: string | null
          total_entries: number | null
          total_feedback: number | null
          total_winnings: number | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          total_entries?: number | null
          total_feedback?: number | null
          total_winnings?: number | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          total_entries?: number | null
          total_feedback?: number | null
          total_winnings?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      site_statistics: {
        Row: {
          active_users_baseline: number
          created_at: string
          id: string
          products_validated_baseline: number
          total_prize_pools_baseline: number
          updated_at: string
        }
        Insert: {
          active_users_baseline?: number
          created_at?: string
          id?: string
          products_validated_baseline?: number
          total_prize_pools_baseline?: number
          updated_at?: string
        }
        Update: {
          active_users_baseline?: number
          created_at?: string
          id?: string
          products_validated_baseline?: number
          total_prize_pools_baseline?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          post_id: string | null
          reward_amount: number | null
          reward_description: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          post_id?: string | null
          reward_amount?: number | null
          reward_description?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          post_id?: string | null
          reward_amount?: number | null
          reward_description?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activities_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_strikes: {
        Row: {
          created_at: string
          id: string
          is_suspended: boolean
          last_strike_at: string | null
          strike_count: number
          suspended_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_suspended?: boolean
          last_strike_at?: string | null
          strike_count?: number
          suspended_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_suspended?: boolean
          last_strike_at?: string | null
          strike_count?: number
          suspended_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          referral_source: string | null
          signup_date: string
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          referral_source?: string | null
          signup_date?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          referral_source?: string | null
          signup_date?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      winners: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          payout_status: string | null
          position: number
          post_id: string
          prize_amount: number
          stripe_transfer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          payout_status?: string | null
          position: number
          post_id: string
          prize_amount: number
          stripe_transfer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          payout_status?: string | null
          position?: number
          post_id?: string
          prize_amount?: number
          stripe_transfer_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_session_info: {
        Row: {
          admin_user_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string | null
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          token_status: string | null
          user_agent: string | null
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string | null
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          token_status?: never
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string | null
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          token_status?: never
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_and_secure_admin_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_expired_admin_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_admin_session: {
        Args: {
          p_admin_user_id: string
          p_expires_at: string
          p_ip_address?: string
          p_session_token: string
          p_user_agent?: string
        }
        Returns: string
      }
      get_comments_for_author: {
        Args: { p_post_id: string }
        Returns: {
          content: string
          created_at: string
          id: string
          is_boosted: boolean
          is_reported_by_author: boolean
          likes: number
          post_id: string
          report_status: string
          updated_at: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hash_session_token: {
        Args: { token_value: string }
        Returns: string
      }
      increment_user_strike: {
        Args: { target_user_id: string }
        Returns: {
          is_suspended: boolean
          new_strike_count: number
        }[]
      }
      log_admin_activity: {
        Args: {
          p_action_type: string
          p_details?: Json
          p_ip_address?: string
          p_resource_id?: string
          p_resource_type?: string
          p_user_agent?: string
        }
        Returns: string
      }
      log_financial_access: {
        Args: { p_operation: string; p_record_id: string; p_table_name: string }
        Returns: undefined
      }
      report_feedback_as_author: {
        Args: {
          p_comment_id: string
          p_report_details?: string
          p_report_reason: string
        }
        Returns: Json
      }
      validate_financial_operation: {
        Args: { p_amount: number; p_user_id: string }
        Returns: boolean
      }
      verify_admin_access: {
        Args: { session_token?: string }
        Returns: {
          expires_at: string
          is_valid: boolean
          user_id: string
        }[]
      }
      verify_session_token: {
        Args: { token_hash: string; token_value: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
