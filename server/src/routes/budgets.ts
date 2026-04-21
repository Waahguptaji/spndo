import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { getBudgetSchema, putBudgetSchema } from "../schemas/budgets.js";
import { prisma } from "../lib/prisma.js";

export const budgetRoutes: FastifyPluginAsync = async (fastify, _options) => {
  fastify.get(
    "/budgets/:month",
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      preHandler: [(fastify as any).authenticate],
    },
    async (
      request: FastifyRequest<{
        Params: {
          month: string;
        };
      }>,
      reply,
    ) => {
      try {
        const userId = request.user.userId;
        const { month } = request.params;

        const validation = getBudgetSchema.safeParse({
          userId,
          month,
        });
        if (!validation.success) {
          return reply.code(400).send({
            error: "Invalid request data",
            details: validation.error.format(),
          });
        }

        // Convert month string (YYYY-MM) to DateTime (first day of the month) using UTC
        const monthDate = new Date(`${month}-01T00:00:00.000Z`);

        const budget = await prisma.budget.findMany({
          where: {
            userId: userId,
            month: monthDate,
          },
        });
        reply.send(budget);
      } catch (error) {
        fastify.log.error(error, "Error fetching budgets");
        return reply.code(500).send({ error: "Failed to fetch budgets" });
      }
    },
  );
  fastify.put(
    "/budgets/:month",
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      preHandler: [(fastify as any).authenticate],
    },
    async (
      request: FastifyRequest<{
        Params: {
          month: string;
        };
        Body: Array<{
          amount: number;
          categoryId: string;
        }>;
      }>,
      reply,
    ) => {
      try {
        const userId = request.user.userId;
        const { month } = request.params;
        const budgets = request.body;

        const validation = putBudgetSchema.safeParse({
          userId,
          month,
          budgets,
        });

        if (!validation.success) {
          return reply.code(400).send({
            error: "Invalid request data",
            details: validation.error.format(),
          });
        }

        // Convert month string (YYYY-MM) to DateTime (first day of the month) using UTC
        const monthDate = new Date(`${month}-01T00:00:00.000Z`);

        // Verify all categories exist and belong to the user
        const categoryIds = budgets.map((b) => b.categoryId);
        const uniqueCategoryIds = [...new Set(categoryIds)];
        const existingCategories = await prisma.categories.findMany({
          where: {
            id: { in: uniqueCategoryIds },
            userId: userId,
          },
        });

        if (existingCategories.length !== uniqueCategoryIds.length) {
          return reply.code(404).send({
            error: "Category not found",
            message:
              "One or more specified categories do not exist or do not belong to you",
          });
        }

        // Upsert all budgets
        const results = await Promise.all(
          budgets.map(({ categoryId, amount }) =>
            prisma.budget.upsert({
              where: {
                userId_categoryId_month: {
                  userId,
                  month: monthDate,
                  categoryId,
                },
              },
              create: {
                userId,
                month: monthDate,
                amount,
                categoryId,
              },
              update: {
                amount,
              },
            }),
          ),
        );

        reply.send(results);
      } catch (error) {
        fastify.log.error(error, "Error updating budget");
        return reply.code(500).send({ error: "Failed to update budget" });
      }
    },
  );
};
