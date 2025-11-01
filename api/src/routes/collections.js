import { Router } from "express";
import { supabaseAdmin } from "../services/db/supabase.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    const { data, error } = await supabaseAdmin
      .from("collections")
      .select("id, name, color, created_at")
      .eq("owner_key", apiKey)
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    const { name, color } = req.body ?? {};
    const { data, error } = await supabaseAdmin
      .from("collections")
      .insert({ owner_key: apiKey, name, color })
      .select()
      .maybeSingle();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    const { name, color } = req.body ?? {};
    const { data, error } = await supabaseAdmin
      .from("collections")
      .update({ name, color })
      .eq("id", req.params.id)
      .eq("owner_key", apiKey)
      .select()
      .maybeSingle();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { apiKey } = req.context;
    await supabaseAdmin.from("collections").delete().eq("id", req.params.id).eq("owner_key", apiKey);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
