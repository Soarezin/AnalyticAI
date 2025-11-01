import { Router } from "express";
import { createEventStub } from "../lib/calendar/google.js";

const router = Router();

router.post("/event", async (req, res, next) => {
  try {
    const { title, date, description } = req.body ?? {};
    const result = await createEventStub({ title, date, description });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
