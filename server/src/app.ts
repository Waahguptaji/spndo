import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import helmet from "@fastify/helmet";
import fastifyStatic from "@fastify/static";
import fs from "node:fs";
import path from "node:path";
import jwtPlugin from "./plugins/jwt.js";
import health from "./routes/health.js";
import auth from "./routes/auth.js";
import { userRoutes } from "./routes/user.js";
import { categoryRoutes } from "./routes/categories.js";
import { budgetRoutes } from "./routes/budgets.js";
import transactionRoutes from "./routes/transaction.js";
import reminderRoutes from "./routes/reminder.js";
import { goalRoutes } from "./routes/goal.js";
import { aggregateRoutes } from "./routes/aggregate.js";
export function buildApp() {
  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? ["https://spndo.app"]
      : ["https://spndo.app", "http://localhost:3000", "http://127.0.0.1:3000"];
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info",
      transport:
        process.env.NODE_ENV !== "production"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            }
          : undefined,
    },
  });

  const origin =
    process.env.NODE_ENV === "production"
      ? ["https://spndo.app", "https://www.spndo.app"]
      : [
          "https://spndo.app",
          "https://www.spndo.app",
          /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
        ];

  app.register(helmet);
  app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
  app.register(fastifyStatic, {
    root: path.join(process.cwd(), "uploads"),
    prefix: "/uploads/",
  });

  app.get("/uploads/:filename", async (request, reply) => {
    const { filename } = request.params as { filename: string };
    const filePath = path.join(process.cwd(), "uploads", filename);

    if (!fs.existsSync(filePath)) {
      return reply.code(404).send({ error: "File not found" });
    }

    return reply.sendFile(filename);
  });

  app.register(cors, {
    origin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.register(jwtPlugin);
  app.register(health, { prefix: "/" });
  app.register(auth, { prefix: "/auth" });
  app.register(userRoutes, { prefix: "/user" });
  app.register(categoryRoutes);
  app.register(budgetRoutes);
  app.register(transactionRoutes);
  app.register(reminderRoutes);
  app.register(goalRoutes);
  app.register(aggregateRoutes, { prefix: "/summary" });
  return app;
}
