// supabase/schema.sql의 테이블을 손으로 옮겨 적은 최소 타입.
// (supabase gen types를 쓸 수 있으면 그걸로 교체해도 된다.)
export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: { id: string; display_name: string; created_at: string };
        Insert: { id?: string; display_name: string; created_at?: string };
        Update: { id?: string; display_name?: string; created_at?: string };
        Relationships: [];
      };
      passkeys: {
        Row: {
          id: string;
          account_id: string;
          credential_id: string;
          public_key: string;
          counter: number;
          device_label: string;
          created_at: string;
          last_used_at: string | null;
        };
        Insert: {
          id?: string;
          account_id: string;
          credential_id: string;
          public_key: string;
          counter?: number;
          device_label: string;
          created_at?: string;
          last_used_at?: string | null;
        };
        Update: {
          id?: string;
          account_id?: string;
          credential_id?: string;
          public_key?: string;
          counter?: number;
          device_label?: string;
          created_at?: string;
          last_used_at?: string | null;
        };
        Relationships: [];
      };
      private_notes: {
        Row: {
          id: string;
          account_id: string;
          title: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          title: string;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          title?: string;
          body?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      used_challenges: {
        Row: { challenge: string; created_at: string };
        Insert: { challenge: string; created_at?: string };
        Update: { challenge?: string; created_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
