import "dotenv/config";
import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.js";
import documentsRouter from "./routes/documents.js";
import analyzeRouter from "./routes/analyze.js";
import collectionsRouter from "./routes/collections.js";
import tagsRouter from "./routes/tags.js";
import calendarRouter from "./routes/calendar.js";
import apiKeyAuth from "./middlewares/apiKeyAuth.js";
import rateLimitByPlan from "./middlewares/rateLimitByPlan.js";

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN?.split(",") ?? "*",
    credentials: true
  })
);
app.use(express.json({ limit: "25mb" }));

app.use("/api/health", healthRouter);
app.use("/api", apiKeyAuth, rateLimitByPlan);
app.use("/api/documents", documentsRouter);
app.use("/api/analyze", analyzeRouter);
app.use("/api/collections", collectionsRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/calendar", calendarRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

const port = process.env.PORT || 5175;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
