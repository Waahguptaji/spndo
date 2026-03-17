import prisma from "../lib/prisma";
import { FastifyPluginAsync } from "fastify";
import { createReminderSchema } from "../schemas/reminder";

const reminder: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    "/reminders",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const validation = createReminderSchema.safeParse(request.body);

        if (!validation.success) {
          return reply.code(400).send({
            error: "Invalid request data",
            details: validation.error.errors,
          });
        }

        const { title, note, due_at, repeat, is_done } = validation.data;

        const reminder = await prisma.reminder.create({
          data: {
            user_id: request.user!.userId,
            title,
            note,
            due_at,
            repeat,
            is_done,
          },
        });

        return reply.code(201).send({
          message: "Reminder created successfully",
          reminder,
        });
      } catch (err) {
        fastify.log.error(err);
        return reply.code(500).send({
          error: "Internal Server Error",
        });
      }
    },
  );

  fastify.get(
    "/reminders",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const reminders = await prisma.reminder.findMany({
          where: {
            user_id: request.user!.userId,
          },
        });

        return reply.code(200).send({ reminders });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          error: "Internal Server Error",
        });
      }
    },
  );

  fastify.patch(
    "/reminders/:id",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };

        const reminder = await prisma.reminder.findFirst({
          where: {
            id,
            user_id: request.user!.userId,
          },
        });

        if (!reminder) {
          return reply.code(404).send({ error: "Reminder not found." });
        }

        await prisma.reminder.update({
          where: {
            id,
          },
          data: {
            is_done: !reminder.is_done,
          },
        });

        return reply.code(200).send({
          message: "Reminder updated successfully",
          reminder_id: id,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );

  fastify.delete(
    "/reminders/:id",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };

        const reminder = await prisma.reminder.findFirst({
          where: {
            id,
            user_id: request.user!.userId,
          },
        });

        if (!reminder) {
          return reply.code(404).send({ error: "Reminder not found" });
        }

        await prisma.reminder.delete({
          where: {
            id,
          },
        });

        return reply.code(200).send({
          message: "Reminder delete successfully",
          reminder_id: id,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ error: "Internal Server Error" });
      }
    },
  );
};

export default reminder;
