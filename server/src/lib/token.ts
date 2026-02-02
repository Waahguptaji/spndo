import { FastifyInstance } from "fastify";
import prisma from "./prisma";

const createRefreshToken = async (fastify: FastifyInstance, userId: string) => {
  // Create refresh token with DIFFERENT secret
  const refreshToken = fastify.jwt.sign(
    {
      userId,
      type: "refresh",
    },
    {
      secret: process.env.JWT_REFRESH_SECRET, // ← Use refresh secret!
      expiresIn: "7d",
    },
  );

  // Calculate expiration date (7 days from now)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Store in database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt,
    },
  });

  return refreshToken;
};

export default createRefreshToken;
