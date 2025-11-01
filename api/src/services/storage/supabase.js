import { supabaseAdmin } from "../db/supabase.js";

const bucket = process.env.SUPABASE_BUCKET ?? "documents";

export async function uploadPdf({ ownerKey, documentId, buffer }) {
  if (!ownerKey || !documentId) throw new Error("Missing owner key or document id");
  const path = `${ownerKey}/${documentId}.pdf`;
  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, buffer, {
    contentType: "application/pdf",
    upsert: true
  });
  if (error) throw error;
  return { path };
}

export function getPublicUrl(path) {
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
