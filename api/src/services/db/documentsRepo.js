import { prisma } from "./prismaClient.js";

const orderMap = {
  created_desc: { createdAt: "desc" },
  created_asc: { createdAt: "asc" },
  alpha_asc: { filename: "asc" },
  alpha_desc: { filename: "desc" }
};

export async function listDocuments({ ownerKey, query, collectionId, tagIds, page = 1, pageSize = 12, order = "created_desc" }) {
  const filters = {
    ownerKey,
    deletedAt: null
  };

  if (collectionId) {
    filters.collectionId = collectionId;
  }

  if (Array.isArray(tagIds) && tagIds.length) {
    filters.documentTags = {
      some: {
        tagId: { in: tagIds }
      }
    };
  }

  if (query) {
    const contains = query.trim();
    if (contains) {
      filters.OR = [
        { filename: { contains, mode: "insensitive" } },
        {
          analyses: {
            some: {
              summary: {
                contains,
                mode: "insensitive"
              }
            }
          }
        }
      ];
    }
  }

  const [total, documents] = await prisma.$transaction([
    prisma.document.count({ where: filters }),
    prisma.document.findMany({
      where: filters,
      orderBy: orderMap[order] ?? orderMap.created_desc,
      skip: Math.max(page - 1, 0) * pageSize,
      take: pageSize,
      include: {
        collection: true,
        documentTags: { include: { tag: true } },
        analyses: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    })
  ]);

  const items = documents.map((doc) => ({
    id: doc.id,
    filename: doc.filename,
    pages: doc.pages ?? null,
    size_bytes: doc.sizeBytes != null ? Number(doc.sizeBytes) : null,
    status: doc.status,
    created_at: doc.createdAt,
    collection: doc.collection
      ? {
          id: doc.collection.id,
          name: doc.collection.name,
          color: doc.collection.color
        }
      : null,
    tags: doc.documentTags.map(({ tag }) => ({ id: tag.id, name: tag.name, color: tag.color })),
    lastAnalysisSummary: doc.analyses[0]?.summary ?? null
  }));

  return {
    items,
    total,
    page,
    pageSize
  };
}

export async function getDocumentWithAnalysis({ ownerKey, documentId }) {
  const document = await prisma.document.findFirst({
    where: { id: documentId, ownerKey, deletedAt: null },
    include: {
      collection: true,
      documentTags: { include: { tag: true } },
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  if (!document) {
    return null;
  }

  const latestAnalysis = document.analyses[0] ?? null;

  return {
    id: document.id,
    filename: document.filename,
    pages: document.pages ?? null,
    size_bytes: document.sizeBytes != null ? Number(document.sizeBytes) : null,
    status: document.status,
    created_at: document.createdAt,
    storage_path: document.storagePath,
    collection: document.collection
      ? { id: document.collection.id, name: document.collection.name, color: document.collection.color }
      : null,
    tags: document.documentTags.map(({ tag }) => ({ id: tag.id, name: tag.name, color: tag.color })),
    analysis: latestAnalysis
      ? {
          id: latestAnalysis.id,
          summary: latestAnalysis.summary,
          issues: latestAnalysis.issues,
          deadlines: latestAnalysis.deadlines,
          created_at: latestAnalysis.createdAt
        }
      : null
  };
}
