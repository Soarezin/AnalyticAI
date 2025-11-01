import { incrementUsage } from "../services/db/supabase.js";

export default async function rateLimitByPlan(req, res, next) {
  const { apiKey, dailyLimit, usageToday } = req.context ?? {};
  if (!apiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (usageToday >= dailyLimit) {
    return res.status(429).json({ error: "Daily limit reached" });
  }

  try {
    await incrementUsage(apiKey, req.path, 200, usageToday);
  } catch (error) {
    console.error("rateLimitByPlan", error);
  }

  next();
}
