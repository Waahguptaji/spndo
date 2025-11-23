import { PrismaClient } from "@prisma/client";
import fastify, { FastifyPluginAsync } from "fastify";
import { registerSchema } from "../schemas/auth";
import { error } from "console";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const auth: FastifyPluginAsync = async (fastify, options) => {
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

    const { password_hash: _, ...userWithoutPassword } = newUser;

    return reply.code(201).send({
      message: " User registered successfully",
      user: userWithoutPassword,
    });
  });

  fastify.post("/login", async (request, reply) => {
    return { status: "auth route works" };
  });

  fastify.post("/refresh", async (request, reply) => {
    return { status: "refresh route works" };
  });

  fastify.post("/password", async (request, reply) => {
    return { status: "password reset route works" };
  });
};

//ESM
export default auth;
