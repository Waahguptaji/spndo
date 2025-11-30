import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import { loginSchema, registerSchema } from "../schemas/auth";
import bcrypt from "bcrypt";
import createRefreshToken from "../lib/token";

const prisma = new PrismaClient();

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

      const password_hash = await bcrypt.hash(confirmPassword, 10);
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
        { expiresIn: "15m" }
      );

      const refreshToken = await createRefreshToken(fastify, newUser.id);

      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash: _, ...userWithoutPassword } = newUser;

      return reply.code(201).send({
        message: " User registered successfully",
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
        user.password_hash
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
          expiresIn: "15m", // 15 minutes
        }
      );

      // Create refresh token (long-lived)
      const refreshToken = await createRefreshToken(fastify, user.id);

      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash: _, ...userWithoutPassword } = user;

      return reply.code(201).send({
        message: " User login successfully",
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
        return reply.code(400).send({ error: "Refresh token is required" });
      }

      // Verify the JWT signature and extract payload
      const decoded = fastify.jwt.verify(refreshToken) as {
        userId: string;
        type: string;
      };

      // Check if it's actually a refresh token
      if (decoded.type !== "refresh") {
        return reply.code(401).send({
          error: "Invalid token type",
        });
      }

      // Check if token exists in database and is not expired
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken) {
        return reply.code(401).send({
          error: "Invalid refresh token",
        });
      }

      if (storedToken.expiresAt < new Date()) {
        //Token has expired, delete from DB
        await prisma.refreshToken.delete({
          where: { token: refreshToken },
        });
        return reply.code(401).send({
          error: "Refresh token has expired",
        });
      }

      // Create new access token
      const newAccessToken = fastify.jwt.sign(
        {
          userId: storedToken.userId,
          email: storedToken.user.email,
        },
        {
          expiresIn: "15m",
        }
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

  fastify.patch("/change-password", async (request, reply) => {
    //password change logic here
    try {
      // Verify the user is authenticated
      await request.jwtVerify();

      const { oldPassword, newPassword, confirmNewPassword } = request.body as {
        oldPassword: string;
        newPassword: string;
        confirmNewPassword: string;
      };

      if (!oldPassword || !newPassword || !confirmNewPassword) {
        return reply.code(400).send({
          error: "Old password, new password and confirm password are required",
        });
      }

      if (newPassword !== confirmNewPassword) {
        return reply.code(400).send({
          error: "Passwords do not match",
        });
      }

      // Get userId from JWT token
      const { userId } = request.user as { userId: string; email: string };

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.password_hash) {
        return reply.code(404).send({
          error: "User not found",
        });
      }

      // Verify old password
      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.password_hash
      );

      if (!isOldPasswordValid) {
        return reply.code(401).send({
          error: "Old password is incorrect",
        });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: userId },
        data: {
          password_hash: newPasswordHash,
        },
      });

      // Optionally: Invalidate all refresh tokens for this user
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });

      return reply.code(200).send({
        message: "Password changed successfully",
      });
    } catch (err) {
      if (err instanceof Error && err.name === "UnauthorizedError") {
        return reply.code(401).send({
          error: "Unauthorized - Valid token required",
        });
      }
      console.error("Error during password change:", err);
      return reply.code(500).send({
        error: "Internal Server Error",
      });
    }
  });
};

//ESM
export default auth;
