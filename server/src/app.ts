import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { logger } from "./lib/logger";
// import { env } from "./config/env";
import jwtPlugin from "./plugins/jwt";
import health from "./routes/health";

export function buildApp() {
  const app = Fastify({ logger });

  app.register(helmet);
  app.register(cors, {
    origin: (origin, cb) => {
      // Accept all in dev; set a proper allowlist for prod
      cb(null, true);
    },
  });

  app.register(jwtPlugin);
  app.register(health, { prefix: "/" });

  return app;
}
