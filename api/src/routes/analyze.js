import { Router } from "express";
import { randomUUID } from "crypto";
import { extractText } from "../services/pdf/parsePdf.js";
import { summarizeText } from "../services/nlp/summarize.js";
import { extractIssues } from "../services/nlp/extractIssues.js";
import { extractDeadlines } from "../services/nlp/extractDeadlines.js";
import { uploadPdf, getPublicUrl } from "../services/storage/supabase.js";
import { supabaseAdmin } from "../services/db/supabase.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { fileBase64, filename, collectionId = null, tagIds = [], options = {} } = req.body ?? {};
    if (!fileBase64 || !filename) {
      return res.status(400).json({ error: "Missing fileBase64 or filename" });
    }

    const matches = fileBase64.match(/^data:.*;base64,(.*)$/);
    const buffer = Buffer.from(matches ? matches[1] : fileBase64, "base64");

    const documentId = randomUUID();
    const ownerKey = req.context.apiKey;

    const { error: insertError } = await supabaseAdmin
      .from("documents")
      .insert({
        id: documentId,
        owner_key: ownerKey,
        filename,
        status: "processing",
        collection_id: collectionId,
        size_bytes: buffer.byteLength
      })
      .select()
      .maybeSingle();
    if (insertError) throw insertError;

    await uploadPdf({ ownerKey, documentId, buffer });

    const { text, pages } = await extractText(buffer);
    const summary = await summarizeText(text);
    const issues = await extractIssues(text);
    const shouldDetectDeadlines = options.detectDeadlines !== false;
    const deadlines = shouldDetectDeadlines ? await extractDeadlines(text) : [];

    const analysisPayload = {
      id: randomUUID(),
      document_id: documentId,
      summary,
      issues,
      deadlines
    };

    const { error: analysisError } = await supabaseAdmin.from("analyses").insert(analysisPayload);
    if (analysisError) throw analysisError;

    const storagePath = `${ownerKey}/${documentId}.pdf`;

    await supabaseAdmin
      .from("documents")
      .update({ status: "processed", pages, storage_path: storagePath })
      .eq("id", documentId);

    if (tagIds?.length) {
      await supabaseAdmin.from("document_tags").delete().eq("document_id", documentId);
      const relations = tagIds.map((tagId) => ({ document_id: documentId, tag_id: tagId }));
      await supabaseAdmin.from("document_tags").insert(relations);
    }

    const publicUrl = getPublicUrl(storagePath);

    res.json({
      documentId,
      summary,
      issues,
      deadlines,
      meta: {
        pages,
        plan: req.context.plan,
        remainingToday: Math.max(req.context.dailyLimit - (req.context.usageToday + 1), 0),
        documentId,
        storageUrl: publicUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
