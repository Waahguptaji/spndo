import { PrismaClient } from "@prisma/client";
import  { FastifyPluginAsync } from "fastify";
import { registerSchema } from "../schemas/auth";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const auth: FastifyPluginAsync = async (fastify, _options) => {
  fastify.post("/register", async (request, reply) => {
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
    console.log("User Created:", newUser);

    const token = fastify.jwt.sign({
      userId: newUser.id,
      email: newUser.email,
    });
    console.log("Generated token:", token);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _, ...userWithoutPassword } = newUser;

    return reply.code(201).send({
      message: " User registered successfully",
      user: userWithoutPassword,
    });
  });

  fastify.post("/login", async (_request, _reply) => {
    return { status: "auth route works" };
  });

  fastify.post("/refresh", async (_request, _reply) => {
    return { status: "refresh route works" };
  });

  fastify.post("/password", async (_request, _reply) => {
    return { status: "password reset route works" };
  });
};

//ESM
export default auth;
