import { prisma } from "../lib/prisma.js";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import fs from "node:fs";
import path from "node:path";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

type ProfileDataObject = {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  image?: string;
  [key: string]: JsonValue | undefined;
};

function saveDataUrlImage(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;

  const [, mimeType, base64] = match;
  const extension = mimeType.split("/")[1]?.split("+")[0] || "png";
  const buffer = Buffer.from(base64, "base64");
  const fileName = `${Date.now()}.${extension}`;
  const uploadsDir = path.join(process.cwd(), "uploads");
  const filePath = path.join(uploadsDir, fileName);

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  fs.writeFileSync(filePath, buffer);
  return `/uploads/${fileName}`;
}

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

      reply.send({
        ...user,
        phone: user.phone ?? null,
        profile_data: user.profile_data ?? null,
      });
    },
  );

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
      const email = request.body?.email;
      let phone = request.body?.phone;
      let profile_data = request.body?.profile_data as
        | ProfileDataObject
        | undefined;

      if (typeof phone === "string") {
        phone = phone.trim() || undefined;
      }

      if (profile_data?.image && profile_data.image.startsWith("data:image/")) {
        const imageUrl = saveDataUrlImage(profile_data.image);
        if (imageUrl) {
          profile_data = {
            ...profile_data,
            image: imageUrl,
          };
        }
      }

      const data: {
        email?: string;
        phone?: string;
        profile_data?: JsonValue | null;
      } = {
        email,
        phone,
      };

      if (profile_data !== undefined) {
        data.profile_data = profile_data as unknown as JsonValue;
      }

      const user = await prisma.user.update({
        where: { id: request.user.userId.toString() },
        data: data as never,
      });

      reply.send({
        ...user,
        phone: user.phone ?? null,
        profile_data: user.profile_data ?? null,
      });
    },
  );
};
