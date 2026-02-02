import prisma from "../lib/prisma";
import { FastifyPluginAsync } from "fastify";
import { createTransactionSchema } from "../schemas/transaction";
import { request } from "http";

const transactions: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/transactions",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const validation = createTransactionSchema.safeParse(request.body);

        if (!validation.success) {
          return reply.code(400).send({
            error: "Invalid request data",
            details: validation.error.errors,
          });
        }

        const {
          title,
          amount,
          occurred_at,
          category_id,
          type,
          note,
          metadata,
        } = validation.data;

        // Verify category exists and belongs to user
        const category = await prisma.categories.findFirst({
          where: {
            id: category_id,
            userId: request.user!.userId,
          },
        });

        if (!category) {
          return reply.code(404).send({
            error: "Category not found or does not belong to user",
          });
        }

        // Verify category type matches transaction type
        if (category.type !== type) {
          return reply.code(400).send({
            error: `Category type (${category.type}) does not match transaction type (${type})`,
          });
        }

        // Create transaction
        const transaction = await prisma.transaction.create({
          data: {
            user_id: request.user!.userId,
            title,
            amount,
            type,
            category_id,
            occurred_at: new Date(occurred_at),
            note,
            metadata,
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        });

        return reply.code(201).send({
          message: "Transaction created successfully",
          transaction,
        });
      } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({
          error: "Internal Server Error",
        });
      }
    },
  );

  // GET /transactions - Get all user transactions
  fastify.get(
    "/transactions",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const transactions = await prisma.transaction.findMany({
          where: {
            user_id: request.user!.userId,
            is_deleted: false,
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
          orderBy: {
            occurred_at: "desc",
          },
        });

        return reply.send({ transactions });
      } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  fastify.delete(
    "/transactions/:id",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };

        const transaction = await prisma.transaction.findFirst({
          where: {
            id,
            user_id: request.user!.userId,
            is_deleted: false,
          },
        });

        await prisma.transaction.update({
          where: { id },
          data: { is_deleted: true },
        });

        if (!transaction) {
          return reply.code(404).send({ error: "Transaction not found" });
        }

        return reply.code(200).send({
          message: "Transaction deleted successfully",
          transaction_id: id,
        });
      } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );
};

export default transactions;
