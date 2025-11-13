import { FastifyPluginAsync } from "fastify";

const health: FastifyPluginAsync = async (app /*opts*/) => {
  app.get("/health", async () => {
    return { ok: true, ts: Date.now() };
  });
};

export default health;
