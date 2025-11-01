import plans from "../lib/plans.js";
import { getApiKeyMetadata } from "../services/db/supabase.js";

export default async function apiKeyAuth(req, res, next) {
  const apiKey = req.header("x-api-key");
  if (!apiKey) {
    return res.status(401).json({ error: "Missing x-api-key" });
  }

  try {
    const metadata = await getApiKeyMetadata(apiKey);
    if (!metadata) {
      return res.status(401).json({ error: "Invalid API key" });
    }
    req.context = {
      apiKey,
      plan: metadata.plan,
      dailyLimit: plans[metadata.plan]?.dailyLimit ?? 10,
      usageToday: metadata.usageToday ?? 0
    };
    next();
  } catch (error) {
    next(error);
  }
}
