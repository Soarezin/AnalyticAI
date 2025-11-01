import { Router } from "express";
import { supabaseAdmin } from "../services/db/supabase.js";
import { listDocuments, getDocumentWithAnalysis } from "../services/db/documentsRepo.js";
import { getPublicUrl } from "../services/storage/supabase.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    const { query = "", collectionId, tagIds, page = 1, pageSize = 12, order } = req.query;
    const tagsFilter = typeof tagIds === "string" ? tagIds.split(",") : Array.isArray(tagIds) ? tagIds : [];

    const result = await listDocuments({
      ownerKey: apiKey,
      query,
      collectionId,
      tagIds: tagsFilter.filter(Boolean),
      page: Number(page),
      pageSize: Number(pageSize),
      order
    });

    res.json({
      ...result,
      meta: {
        plan: req.context.plan,
        remainingToday: Math.max(req.context.dailyLimit - ((req.context.usageToday ?? 0) + 1), 0)
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    const document = await getDocumentWithAnalysis({ ownerKey: apiKey, documentId: req.params.id });
    if (!document) {
      return res.status(404).json({ error: "Not found" });
    }
    const storageUrl = document.storage_path ? getPublicUrl(document.storage_path) : null;
    res.json({
      ...document,
      storageUrl
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    await supabaseAdmin
      .from("documents")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", req.params.id)
      .eq("owner_key", apiKey);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/move", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    const { collectionId = null } = req.body ?? {};
    await supabaseAdmin
      .from("documents")
      .update({ collection_id: collectionId })
      .eq("id", req.params.id)
      .eq("owner_key", apiKey);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/tags", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    const { tagIds = [] } = req.body ?? {};
    await supabaseAdmin.from("document_tags").delete().eq("document_id", req.params.id);
    if (tagIds.length) {
      const relations = tagIds.map((tagId) => ({ document_id: req.params.id, tag_id: tagId }));
      await supabaseAdmin.from("document_tags").insert(relations);
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
