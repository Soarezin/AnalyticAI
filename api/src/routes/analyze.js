import { Router } from "express";
import { randomUUID } from "crypto";
import { extractText } from "../services/pdf/parsePdf.js";
import { summarizeText } from "../services/nlp/summarize.js";
import { extractIssues } from "../services/nlp/extractIssues.js";
import { extractDeadlines } from "../services/nlp/extractDeadlines.js";
import { uploadPdf, getPublicUrl } from "../services/storage/supabase.js";
import { prisma } from "../services/db/prismaClient.js";

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

    await prisma.document.create({
      data: {
        id: documentId,
        ownerKey,
        filename,
        status: "processing",
        collectionId: collectionId || null,
        sizeBytes: BigInt(buffer.byteLength)
      }
    });

    await uploadPdf({ ownerKey, documentId, buffer });

    const { text, pages } = await extractText(buffer);
    const summary = await summarizeText(text);
    const issues = await extractIssues(text);
    const shouldDetectDeadlines = options.detectDeadlines !== false;
    const deadlines = shouldDetectDeadlines ? await extractDeadlines(text) : [];

    const analysisPayload = {
      id: randomUUID(),
      documentId,
      summary,
      issues,
      deadlines
    };

    await prisma.analysis.create({ data: analysisPayload });

    const storagePath = `${ownerKey}/${documentId}.pdf`;

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: "processed",
        pages,
        storagePath
      }
    });

    if (tagIds?.length) {
      await prisma.documentTag.deleteMany({ where: { documentId } });
      const relations = tagIds.map((tagId) => ({ documentId, tagId }));
      await prisma.documentTag.createMany({ data: relations, skipDuplicates: true });
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
