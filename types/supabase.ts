export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: number
          name: string
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          logo_url?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 