import prisma from "../lib/prisma";
import { FastifyPluginAsync } from "fastify";
import { registerSchema, loginSchema } from "../schemas/auth";
import bcrypt from "bcrypt";
import createRefreshToken from "../lib/token";

const auth: FastifyPluginAsync = async (fastify) => {
  fastify.post("/register", async (request, reply) => {
    try {
      const validation = registerSchema.safeParse(request.body);
      if (!validation.success) {
        return reply.code(400).send({
          error: "Invalid request data",
          details: validation.error.errors,
        });
      }

      const { email, password, confirmPassword } = validation.data;

      if (password !== confirmPassword) {
        return reply.code(400).send({
          error: "Passwords do not match",
        });
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply.code(409).send({
          error: "User with this email already exists",
        });
      }

      const password_hash = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          password_hash,
        },
      });

      const accessToken = fastify.jwt.sign(
        {
          userId: newUser.id,
          email: newUser.email,
        },
        {
          expiresIn: "15m",
        },
      );

      const refreshToken = await createRefreshToken(fastify, newUser.id);

      // eslint-disable-next-line
      const { password_hash: _, ...userWithoutPassword } = newUser;

      return reply.code(201).send({
        message: "User registered successfully",
        accessToken,
        refreshToken,
        user: userWithoutPassword,
      });
    } catch (err) {
      console.error("Error during registration:", err);
      return reply.code(500).send({
        error: "Internal Server Error",
      });
    }
  });

  fastify.post("/login", async (request, reply) => {
    try {
      const validation = loginSchema.safeParse(request.body);

      if (!validation.success) {
        return reply.code(400).send({
          error: "Invalid request data",
          details: validation.error.errors,
        });
      }

      const { email, password } = validation.data;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.password_hash) {
        return reply.code(401).send({
          error: "Invalid email or password",
        });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        return reply.code(401).send({
          error: "Invalid email or password",
        });
      }

      const accessToken = fastify.jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        {
          expiresIn: "15m",
        },
      );

      const refreshToken = await createRefreshToken(fastify, user.id);

      // eslint-disable-next-line
      const { password_hash: _, ...userWithoutPassword } = user;

      return reply.send({
        message: "User login successfully",
        accessToken,
        refreshToken,
        user: userWithoutPassword,
      });
    } catch (err) {
      console.error("Error during login:", err);
      return reply.code(500).send({
        error: "Internal Server Error",
      });
    }
  });

  fastify.post("/refresh", async (request, reply) => {
    try {
      const { refreshToken } = request.body as { refreshToken: string };

      if (!refreshToken) {
        return reply.code(400).send({
          error: "Refresh token is required",
        });
      }

      const decoded = fastify.jwt.verify(refreshToken) as {
        userId: string;
        type: string;
      };

      if (decoded.type !== "refresh") {
        return reply.code(401).send({
          error: "Invalid token type",
        });
      }

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken) {
        return reply.code(401).send({
          error: "Refresh token not found",
        });
      }

      if (storedToken.expiresAt < new Date()) {
        await prisma.refreshToken.delete({
          where: { id: storedToken.id },
        });

        return reply.code(401).send({
          error: "Refresh token expired",
        });
      }

      const newAccessToken = fastify.jwt.sign(
        {
          userId: storedToken.userId,
          email: storedToken.user.email,
        },
        {
          expiresIn: "15m",
        },
      );

      return reply.send({
        accessToken: newAccessToken,
      });
    } catch (err) {
      console.error("Error during token refresh:", err);
      return reply.code(401).send({
        error: "Invalid or expired refresh token",
      });
    }
  });

  fastify.post("/logout", async (request, reply) => {
    try {
      const { refreshToken } = request.body as { refreshToken: string };

      if (!refreshToken) {
        return reply.code(400).send({
          error: "Refresh token is required",
        });
      }

      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });

      return reply.send({
        message: "Logged out successfully",
      });
    } catch (err) {
      console.error("Error during logout:", err);
      return reply.code(500).send({
        error: "Internal Server Error",
      });
    }
  });
};

export default auth;
