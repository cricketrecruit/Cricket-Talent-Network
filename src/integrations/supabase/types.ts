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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      player_media: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          media_type: string
          player_id: string
          storage_path: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          media_type: string
          player_id: string
          storage_path: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          media_type?: string
          player_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_media_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "player_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      player_profiles: {
        Row: {
          academy: string
          age_group: Database["public"]["Enums"]["age_group"]
          batting_style: Database["public"]["Enums"]["batting_style"]
          bio: string | null
          bowling_style: Database["public"]["Enums"]["bowling_style"]
          city: string
          contact_email: string
          country: string
          created_at: string
          cv_storage_path: string | null
          dob: string
          first_name: string
          gender: Database["public"]["Enums"]["gender"] | null
          headline: string | null
          last_name: string
          media_consent: boolean
          phone_country_code: string
          phone_number: string
          primary_skill: Database["public"]["Enums"]["primary_skill"]
          profile_photo_path: string | null
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          academy: string
          age_group: Database["public"]["Enums"]["age_group"]
          batting_style: Database["public"]["Enums"]["batting_style"]
          bio?: string | null
          bowling_style: Database["public"]["Enums"]["bowling_style"]
          city: string
          contact_email: string
          country: string
          created_at?: string
          cv_storage_path?: string | null
          dob: string
          first_name: string
          gender?: Database["public"]["Enums"]["gender"] | null
          headline?: string | null
          last_name: string
          media_consent?: boolean
          phone_country_code: string
          phone_number: string
          primary_skill: Database["public"]["Enums"]["primary_skill"]
          profile_photo_path?: string | null
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          academy?: string
          age_group?: Database["public"]["Enums"]["age_group"]
          batting_style?: Database["public"]["Enums"]["batting_style"]
          bio?: string | null
          bowling_style?: Database["public"]["Enums"]["bowling_style"]
          city?: string
          contact_email?: string
          country?: string
          created_at?: string
          cv_storage_path?: string | null
          dob?: string
          first_name?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          headline?: string | null
          last_name?: string
          media_consent?: boolean
          phone_country_code?: string
          phone_number?: string
          primary_skill?: Database["public"]["Enums"]["primary_skill"]
          profile_photo_path?: string | null
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          notify_on_new_player: boolean
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          notify_on_new_player?: boolean
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          notify_on_new_player?: boolean
        }
        Relationships: []
      }
      recruiter_profiles: {
        Row: {
          city: string
          country: string
          created_at: string
          organization_name: string
          organization_type: string
          phone: string | null
          reason_for_access: string
          reviewed_at: string | null
          reviewed_by: string | null
          role_title: string
          status: Database["public"]["Enums"]["recruiter_status"]
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          organization_name: string
          organization_type: string
          phone?: string | null
          reason_for_access: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_title: string
          status?: Database["public"]["Enums"]["recruiter_status"]
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          organization_name?: string
          organization_type?: string
          phone?: string | null
          reason_for_access?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_title?: string
          status?: Database["public"]["Enums"]["recruiter_status"]
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recruiter_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_approved_recruiter: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      age_group: "youth_11_14" | "youth_15_19" | "adult_19_plus"
      app_role: "admin" | "recruiter" | "player"
      batting_style: "right_handed" | "left_handed"
      bowling_style:
        | "right_arm_pace"
        | "right_arm_medium"
        | "left_arm_pace"
        | "left_arm_medium"
        | "off_spin"
        | "leg_spin"
        | "left_arm_orthodox"
        | "chinaman"
      gender: "male" | "female" | "other"
      primary_skill:
        | "batter"
        | "bowler"
        | "wicket_keeper"
        | "batting_all_rounder"
        | "bowling_all_rounder"
      recruiter_status: "pending" | "approved" | "rejected"
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
      age_group: ["youth_11_14", "youth_15_19", "adult_19_plus"],
      app_role: ["admin", "recruiter", "player"],
      batting_style: ["right_handed", "left_handed"],
      bowling_style: [
        "right_arm_pace",
        "right_arm_medium",
        "left_arm_pace",
        "left_arm_medium",
        "off_spin",
        "leg_spin",
        "left_arm_orthodox",
        "chinaman",
      ],
      gender: ["male", "female", "other"],
      primary_skill: [
        "batter",
        "bowler",
        "wicket_keeper",
        "batting_all_rounder",
        "bowling_all_rounder",
      ],
      recruiter_status: ["pending", "approved", "rejected"],
    },
  },
} as const
