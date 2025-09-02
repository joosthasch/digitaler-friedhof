import { createClient } from '@supabase/supabase-js';

// You'll get these from your Supabase project dashboard
const supabaseUrl = 'https://lgibcnvwdhgjdohoikbh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnaWJjbnZ3ZGhnamRvaG9pa2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4Njk2MzcsImV4cCI6MjA2OTQ0NTYzN30.NfHsg5e8IPpuP_PMaz-Dcf5nKaE9XW_TFB9rRH1RAZQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (we'll expand this)
export interface Database {
  public: {
    Tables: {
      memorials: {
        Row: {
          id: string;
          name: string;
          birth_year: number;
          death_year: number;
          description: string | null;
          profile_image: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          birth_year: number;
          death_year: number;
          description?: string | null;
          profile_image?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          birth_year?: number;
          death_year?: number;
          description?: string | null;
          profile_image?: string | null;
          created_by?: string;
          created_at?: string;
        };
      };
    };
  };
}