import { prisma } from "../lib/prisma";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { userSchema, profileDataSchema } from "../schemas/user";
import { Prisma } from "@prisma/client";

export const userRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.get(
    "/me",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { preHandler: [(fastify as any).authenticate] },
    async (request: FastifyRequest, reply) => {
      const user = await prisma.user.findUnique({
        where: { id: request.user.userId },
        select: {
          id: true,
          email: true,
          phone: true,
          profile_data: true,
        },
      });

      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      const validation = userSchema.safeParse(user);
      if (!validation.success) {
        return reply.code(400).send({
          error: "User data is invalid ",
          details: validation.error.format(),
        });
      }

      reply.send(user);
    },
  );
};
export const userRoute: FastifyPluginAsync = async (fastify, _options) => {
  fastify.patch(
    "/me",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { preHandler: [(fastify as any).authenticate] },
    async (
      request: FastifyRequest<{
        Body: {
          email?: string;
          phone?: string;
          profile_data?: Prisma.InputJsonValue;
        };
      }>,
      reply,
    ) => {
      const { email, phone, profile_data } = request.body;

      const user = await prisma.user.update({
        where: { id: request.user.userId.toString() },

        data: {
          email,
          phone,
          profile_data: profile_data ?? Prisma.DbNull,
        },
      });

      const validation = profileDataSchema.safeParse(request.body);
      if (!validation.success) {
        return reply.send({
          error: "Invalid data",
          details: validation.error.format(),
        });
      } else {
        reply.send("db updated successfully!" + JSON.stringify(user));
      }
    },
  );
};
