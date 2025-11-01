import { Router } from "express";
import { prisma } from "../services/db/prismaClient.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    const collections = await prisma.collection.findMany({
      where: { ownerKey: apiKey },
      orderBy: { createdAt: "desc" }
    });

    res.json(
      collections.map((collection) => ({
        id: collection.id,
        name: collection.name,
        color: collection.color,
        created_at: collection.createdAt
      }))
    );
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    const { name, color } = req.body ?? {};

    const created = await prisma.collection.create({
      data: { ownerKey: apiKey, name, color: color ?? null }
    });

    res.status(201).json({
      id: created.id,
      name: created.name,
      color: created.color,
      created_at: created.createdAt
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    const { name, color } = req.body ?? {};

    const existing = await prisma.collection.findFirst({ where: { id: req.params.id, ownerKey: apiKey } });
    if (!existing) {
      return res.status(404).json({ error: "Not found" });
    }

    const updateData = {};
    if (typeof name === "string") {
      updateData.name = name;
    }
    if (typeof color !== "undefined") {
      updateData.color = color;
    }

    if (Object.keys(updateData).length === 0) {
      return res.json({
        id: existing.id,
        name: existing.name,
        color: existing.color,
        created_at: existing.createdAt
      });
    }

    const updated = await prisma.collection.update({
      where: { id: existing.id },
      data: updateData
    });

    res.json({
      id: updated.id,
      name: updated.name,
      color: updated.color,
      created_at: updated.createdAt
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    await prisma.collection.deleteMany({ where: { id: req.params.id, ownerKey: apiKey } });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
