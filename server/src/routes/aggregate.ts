import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";

type Category = {
  id: string;
  name: string;
};

type CategoryAggregate = {
  category_id: string;
  _sum: {
    amount: number | null;
  };
};
export const aggregateRoutes: FastifyPluginAsync = async (
  fastify,
  _optional,
) => {
  fastify.get(
    "/monthly",
    {
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply) => {
      try {
        const userId = request.user.userId;
        const { month } = request.query as { month: string };

        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const incomeAggregate = await prisma.transaction.aggregate({
          where: {
            user_id: userId,
            is_deleted: false,
            type: "INCOME",
            occurred_at: {
              gte: startDate,
              lt: endDate,
            },
          },
          _sum: {
            amount: true,
          },
        });
        const expenseAggregate = await prisma.transaction.aggregate({
          where: {
            user_id: userId,
            is_deleted: false,
            type: "EXPENSE",
            occurred_at: {
              gte: startDate,
              lt: endDate,
            },
          },
          _sum: {
            amount: true,
          },
        });
        const byCategory = await prisma.transaction.groupBy({
          by: ["category_id"],
          where: {
            user_id: userId,
            is_deleted: false,
            type: "EXPENSE",
            occurred_at: {
              gte: startDate,
              lt: endDate,
            },
          },
          _sum: {
            amount: true,
          },
        });
        const categoryIds = await prisma.categories.findMany({
          where: {
            id: {
              in: byCategory.map((c: { category_id: string }) => c.category_id),
            },
          },
        });
        const categoryMap = new Map(
          (categoryIds as Category[]).map((c) => [c.id, c.name]),
        );

        const formattedByCategory = (byCategory as CategoryAggregate[]).map(
          (c) => {
            return {
              category: categoryMap.get(c.category_id) || "Unknown",
              amount: c._sum.amount || 0,
            };
          },
        );
        const incomeTotal = Number(incomeAggregate._sum.amount || 0);
        const expenseTotal = Number(expenseAggregate._sum.amount || 0);
        reply.send({
          income: incomeTotal,
          expense: expenseTotal,
          byCategory: formattedByCategory,
          net: incomeTotal - expenseTotal,
        });
      } catch (error) {
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    },
  );
};
