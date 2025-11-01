import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.warn("Supabase credentials missing. TODO: enforce at runtime.");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole, {
  auth: { persistSession: false }
});

export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

export async function getApiKeyMetadata(apiKey) {
  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("api_key, plan, usage_today")
    .eq("api_key", apiKey)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function incrementUsage(apiKey, endpoint, status, currentUsage = 0) {
  // TODO: mover para função SQL com reset automático.
  await supabaseAdmin.from("usage_logs").insert({ api_key: apiKey, endpoint, status });
  await supabaseAdmin
    .from("api_keys")
    .update({ usage_today: (currentUsage ?? 0) + 1 })
    .eq("api_key", apiKey);
}
