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
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          username: string
          avatar_url?: string
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          username: string
          avatar_url?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          username?: string
          avatar_url?: string
        }
      }
      teams: {
        Row: {
          id: number
          name: string
          logo_url: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          logo_url: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          logo_url?: string
          created_at?: string
        }
      }
      chats: {
        Row: {
          id: number
          team_id: number
          user_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: number
          team_id: number
          user_id: string
          message: string
          created_at?: string
        }
        Update: {
          id?: number
          team_id?: number
          user_id?: string
          message?: string
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