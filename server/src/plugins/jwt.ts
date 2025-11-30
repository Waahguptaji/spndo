import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin";

async function jwtPlugin(app: FastifyInstance) {
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "dev-secret",
  });

  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const decoded = await request.jwtVerify();
        request.user= decoded;
        console.log("Decoded JWT:", decoded);
      } catch (err) {
        reply.code(401).send({ error: "Unauthorized" });
      }
    }
  );
}

// CRITICAL: Wrap with fp() to make jwt available in routes!
export default fp(jwtPlugin);
