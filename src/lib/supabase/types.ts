export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type InspectionType = "opening" | "closing";

export interface DailyInspection {
  id: string;
  inspection_date: string; // YYYY-MM-DD
  inspection_type: InspectionType;
  inspector_name: string | null;
  user_id: string | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InspectionCheck {
  id: string;
  inspection_id: string;
  step_id: number;
  is_checked: boolean;
  checked_at: string;
  checked_by: string | null;
  user_id: string | null;
}

export interface Database {
  public: {
    Tables: {
      daily_inspections: {
        Row: DailyInspection;
        Insert: {
          id?: string;
          inspection_date?: string;
          inspection_type: InspectionType;
          inspector_name?: string | null;
          user_id?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          inspection_date?: string;
          inspection_type?: InspectionType;
          inspector_name?: string | null;
          user_id?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      inspection_checks: {
        Row: InspectionCheck;
        Insert: {
          id?: string;
          inspection_id: string;
          step_id: number;
          is_checked?: boolean;
          checked_at?: string;
          checked_by?: string | null;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          inspection_id?: string;
          step_id?: number;
          is_checked?: boolean;
          checked_at?: string;
          checked_by?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
