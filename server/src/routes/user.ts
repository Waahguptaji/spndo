import { prisma } from "../lib/prisma";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { userSchema, profileDataSchema } from "../schemas/user";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

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
          profile_data?: JsonValue;
        };
      }>,
      reply,
    ) => {
      const { email, phone, profile_data } = request.body;

      const data: {
        email?: string;
        phone?: string;
        profile_data?: JsonValue | null;
      } = {
        email,
        phone,
      };

      if (profile_data !== undefined) {
        data.profile_data = profile_data;
      }

      const user = await prisma.user.update({
        where: { id: request.user.userId.toString() },
        data: data as never,
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
