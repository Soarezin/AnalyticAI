import { createClient } from "@supabase/supabase-js";
import { prisma } from "./prismaClient.js";

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
  return prisma.apiKey.findUnique({
    where: { apiKey },
    select: {
      apiKey: true,
      plan: true,
      usageToday: true
    }
  });
}

export async function incrementUsage(apiKey, endpoint, status, currentUsage = 0) {
  // TODO: mover para função SQL com reset automático.
  await prisma.$transaction([
    prisma.usageLog.create({ data: { apiKey, endpoint, status } }),
    prisma.apiKey.update({
      where: { apiKey },
      data: { usageToday: (currentUsage ?? 0) + 1 }
    })
  ]);
}
