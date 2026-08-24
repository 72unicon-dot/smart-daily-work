import {createClient, type SupabaseClient} from "@supabase/supabase-js";

export type WorkTask = {
  id: string;
  client_id: string;
  title: string;
  description: string;
  importance: number;
  urgency: number;
  due_date: string;
  estimated_hours: number;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hrkggduwnsvyzjllyaat.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_rN7uqyD1KPtJXEbAnNrKwQ_Cd4DXVZD";

export function getClientId() {
  if (typeof window === "undefined") return "";
  const key = "smart-daily-work-client-id";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(key, id);
  }
  return id;
}

export function createWorkTaskClient(clientId: string): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: {headers: {"x-client-id": clientId}},
    auth: {persistSession: false, autoRefreshToken: false},
  });
}
