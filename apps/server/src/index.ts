import cors from "cors";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";
import express from "express";
import { db } from "./db";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "@repo/server",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from Express API"
  });
});

app.get("/api/db-health", async (req, res) => {
  try {
    await db.execute(sql`select 1`);
    res.json({
      status: "ok",
      database: "connected"
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(500).json({
      status: "error",
      database: "disconnected"
    });
  }
});

app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}`);
});
