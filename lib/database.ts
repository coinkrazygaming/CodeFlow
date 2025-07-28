import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  github_username?: string;
  subscription_tier: 'free' | 'premium';
  ai_edits_used: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  github_repo?: string;
  deployment_url?: string;
  status: 'draft' | 'building' | 'deployed' | 'error';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface AIEdit {
  id: string;
  user_id: string;
  project_id?: string;
  prompt: string;
  response: string;
  created_at: string;
}

export interface Domain {
  id: string;
  domain: string;
  project_id: string;
  verified: boolean;
  dns_records: any;
  created_at: string;
}
