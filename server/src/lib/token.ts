import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function createRefreshToken(
  fastify: any,
  userId: string
): Promise<string> {
  const refreshToken = fastify.jwt.sign(
    {
      userId: userId,
      type: "refresh",
    },
    {
      expiresIn: "7d",
    }
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: userId,
      expiresAt: expiresAt,
    },
  });

  return refreshToken;
}

export default createRefreshToken;
