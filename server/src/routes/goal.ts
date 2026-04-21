import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import {
  postGoalSchema,
  getGoalSchema,
  patchGoatSchema,
  deleteGoalSchema,
} from "../schemas/goal.js";

type GoalStatus = "active" | "completed" | "cancelled" | "paused";

export const goalRoutes: FastifyPluginAsync = async (fastify, _optional) => {
  fastify.post(
    "/goals",
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      preHandler: [(fastify as any).authenticate],
    },
    async (
      request: FastifyRequest<{
        Body: {
          title: string;
          target_amount: number;
          deadline: Date;
          status: GoalStatus;
          progress_amount: number;
        };
      }>,
      reply,
    ) => {
      try {
        const userId = request.user.userId;
        const { title, target_amount, deadline, status, progress_amount } =
          request.body;
        const dateObj = new Date(deadline);
        const isValidation = postGoalSchema.safeParse({
          userId,
          title,
          target_amount,
          deadline: dateObj,
          status: status?.toLowerCase(),
          progress_amount,
        });
        if (!isValidation.success) {
          return reply.code(400).send({
            error: "Invalid request data",
            details: isValidation.error.format(),
          });
        }

        const goal = await prisma.goal.create({
          data: {
            userId: userId,
            title,
            target_amount: target_amount,
            deadline,
            status: status || "active",
            progress_amount: progress_amount,
          },
        });
        reply.code(201).send(goal);
      } catch (error) {
        reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );
  fastify.get(
    "/goals",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { preHandler: [(fastify as any).authenticate] },
    async (request: FastifyRequest, reply) => {
      try {
        const userId = request.user.userId;
        const isValidation = getGoalSchema.safeParse({
          userId,
        });
        if (!isValidation.success) {
          return reply.code(400).send({
            error: "Invalid request data",
            details: isValidation.error.format(),
          });
        }
        const goals = await prisma.goal.findMany({
          where: {
            userId: userId,
          },
        });
        reply.code(200).send(goals);
      } catch (error) {
        reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );
  fastify.patch(
    "/goals/:goalId",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { preHandler: [(fastify as any).authenticate] },
    async (
      request: FastifyRequest<{
        Params: {
          goalId: string;
        };
        Body: {
          title: string;
          target_amount?: number;
          deadline?: Date;
          status?: "active" | "completed" | "cancelled" | "paused";
          progress_amount: number;
        };
      }>,
      reply,
    ) => {
      try {
        const userId = request.user.userId;
        const { goalId } = request.params;
        const { title, target_amount, deadline, status, progress_amount } =
          request.body;

        const dateObj = deadline ? new Date(deadline) : undefined;

        const isValidation = patchGoatSchema.safeParse({
          userId,
          goalId,
          title,
          target_amount,
          deadline: dateObj,
          status,
          progress_amount,
        });

        if (!isValidation.success) {
          return reply.code(400).send({
            error: "Invalid request data",
            details: isValidation.error.format(),
          });
        }
        const existingGoal = await prisma.goal.findFirst({
          where: {
            id: goalId,
            userId: userId,
          },
        });
        if (!existingGoal) {
          return reply.code(404).send({ error: "Goal not found !!!!!" });
        }
        const updateGoal = await prisma.goal.update({
          where: {
            id: goalId,
          },
          data: {
            title: title || existingGoal.title,
            target_amount:
              target_amount !== undefined
                ? target_amount
                : existingGoal.target_amount,
            deadline: deadline ? dateObj : existingGoal.deadline,
            status: status || existingGoal.status,
            progress_amount:
              progress_amount !== undefined
                ? progress_amount
                : existingGoal.progress_amount,
          },
        });
        reply.code(200).send("goal updated " + updateGoal);
      } catch (error) {
        reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );
  fastify.delete(
    "/goals/:goalId",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { preHandler: [(fastify as any).authenticate] },
    async (
      request: FastifyRequest<{
        Params: {
          goalId: string;
        };
      }>,
      reply,
    ) => {
      try {
        const userId = request.user.userId;
        const { goalId } = request.params;
        const existingGoal = await prisma.goal.findFirst({
          where: {
            id: goalId,
            userId: userId,
          },
        });
        const validation = deleteGoalSchema.safeParse({
          userId,
          goalId,
        });
        if (!validation.success) {
          return reply.code(400).send({
            error: "Invalid request data",
            details: validation.error.format(),
          });
        }
        if (!existingGoal) {
          return reply.code(404).send({ error: "Goal not found !!!!!" });
        }
        const deleteGoal = await prisma.goal.delete({
          where: {
            id: goalId,
            userId: userId,
          },
        });
        reply.code(200).send({ message: "Goal deleted successfully" });
        reply.code(200).send(deleteGoal);
      } catch (error) {
        reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );
};
