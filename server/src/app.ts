import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwtPlugin from "./plugins/jwt.js";
import health from "./routes/health.js";
import auth from "./routes/auth.js";
import { userRoutes } from "./routes/user.js";
import { userRoute } from "./routes/user.js";
import { categoryRoutes } from "./routes/categories.js";
import { budgetRoutes } from "./routes/budgets.js";
import transactionRoutes from "./routes/transaction.js";
import reminderRoutes from "./routes/reminder.js";
import { goalRoutes } from "./routes/goal.js";
import { aggregateRoutes } from "./routes/aggregate.js";
export function buildApp() {
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

  app.register(helmet);
  app.register(cors, {
    origin: ["https://spndo.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.register(jwtPlugin);
  app.register(health, { prefix: "/" });
  app.register(auth, { prefix: "/auth" });
  app.register(userRoute, { prefix: "/user" });
  app.register(categoryRoutes);
  app.register(budgetRoutes);
  app.register(transactionRoutes);
  app.register(reminderRoutes);
  app.register(goalRoutes);
  app.register(aggregateRoutes, { prefix: "/summary" });
  return app;
}
