import { Router } from "express";
import { prisma } from "../services/db/prismaClient.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    const tags = await prisma.tag.findMany({
      where: { ownerKey: apiKey },
      orderBy: { createdAt: "desc" }
    });
    res.json(tags.map((tag) => ({ id: tag.id, name: tag.name, color: tag.color, created_at: tag.createdAt })));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    const { name, color } = req.body ?? {};
    const created = await prisma.tag.create({
      data: { ownerKey: apiKey, name, color: color ?? null }
    });
    res.status(201).json({ id: created.id, name: created.name, color: created.color, created_at: created.createdAt });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Tag already exists" });
    }
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    await prisma.tag.deleteMany({ where: { id: req.params.id, ownerKey: apiKey } });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
