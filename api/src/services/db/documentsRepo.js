import { supabaseAdmin } from "./supabase.js";

export async function listDocuments({ ownerKey, query, collectionId, tagIds, page = 1, pageSize = 12, order = "created_desc" }) {
  let docIdsFilter = null;
  if (tagIds?.length) {
    const { data: docTags } = await supabaseAdmin
      .from("document_tags")
      .select("document_id")
      .in("tag_id", tagIds);
    docIdsFilter = [...new Set(docTags?.map((item) => item.document_id))];
    if (!docIdsFilter.length) {
      return { items: [], total: 0, page, pageSize };
    }
  }

  const from = supabaseAdmin
    .from("documents")
    .select(
      `id, filename, pages, size_bytes, status, created_at, storage_path, collection:collection_id(id, name, color), document_tags(tag_id, tags(id, name, color)), analyses(summary)`,
      { count: "exact" }
    )
    .eq("owner_key", ownerKey)
    .is("deleted_at", null)
    .order("created_at", { referencedTable: "analyses", ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (query) {
    const sanitized = `%${query}%`;
    from.or(`filename.ilike.${sanitized},analyses.summary.ilike.${sanitized}`);
  }
  if (collectionId) {
    from.eq("collection_id", collectionId);
  }
  if (docIdsFilter) {
    from.in("id", docIdsFilter);
  }

  const orderMap = {
    created_desc: { column: "created_at", ascending: false },
    created_asc: { column: "created_at", ascending: true },
    alpha_asc: { column: "filename", ascending: true },
    alpha_desc: { column: "filename", ascending: false }
  };
  const { column, ascending } = orderMap[order] ?? orderMap.created_desc;
  from.order(column, { ascending });

  const { data, error, count } = await from;
  if (error) throw error;
  const items = data.map((doc) => ({
    id: doc.id,
    filename: doc.filename,
    pages: doc.pages,
    size_bytes: doc.size_bytes,
    status: doc.status,
    created_at: doc.created_at,
    collection: doc.collection,
    tags: doc.document_tags?.map((item) => item.tags) ?? [],
    lastAnalysisSummary: doc.analyses?.[0]?.summary ?? null
  }));

  return {
    items,
    total: count ?? items.length,
    page,
    pageSize
  };
}

export async function getDocumentWithAnalysis({ ownerKey, documentId }) {
  const { data, error } = await supabaseAdmin
    .from("documents")
    .select(
      `id, filename, pages, size_bytes, status, created_at, storage_path, collection:collection_id(id, name, color), document_tags(tag_id, tags(id, name, color)), analyses(id, summary, issues, deadlines, created_at)`
    )
    .eq("id", documentId)
    .eq("owner_key", ownerKey)
    .order("created_at", { referencedTable: "analyses", ascending: false })
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const latestAnalysis = data.analyses?.[0] ?? null;

  return {
    id: data.id,
    filename: data.filename,
    pages: data.pages,
    size_bytes: data.size_bytes,
    status: data.status,
    created_at: data.created_at,
    storage_path: data.storage_path,
    collection: data.collection,
    tags: data.document_tags?.map((item) => item.tags) ?? [],
    analysis: latestAnalysis
  };
}
