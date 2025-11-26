import fastify, { FastifyPluginAsync, FastifyRequest } from "fastify";
import {userSchema,profileDataSchema} from "../schemas/user";
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();

export const userRoutes : FastifyPluginAsync = async (fastify, options) => {
    fastify.get("/me", async (request: FastifyRequest<{Params : {id : string} }>, reply) => {
        const userId = request.params.id;
        const user = await prisma.user.findUnique({
            where: { id: "cmi8ao7q40000rfm14wmtklrv" },
            select: {
                id: true,
                email: true,
                phone: true,
                profile_data: true,
            },
        });

        if (!user) {
            return reply.code(404).send({ error: "User not found" });
        }


        const validation = userSchema.safeParse(user);
        if (!validation.success) {
            return reply.code(400).send({
                error: "User data is invalid",
                details: validation.error.format(),
            });
        }

        reply.send(user);
    });
}
export const userRoute : FastifyPluginAsync = async (fastify, options) => {
    fastify.patch("/me", async (request: FastifyRequest<{ Body: { email?: string; phone?: string; profile_data?:JSON | null } }>, reply) => {
        const { email, phone, profile_data } = request.body;

        const user = await prisma.user.update({
            where: { id: "cmi8ao7q40000rfm14wmtklrv" },
            data: {
                email,
                phone,
                profile_data : profile_data ? profile_data as any : null,
            },
        });
        const validation = profileDataSchema.safeParse(request.body);
        if(!validation.success){
            return reply.send({
                error : "Invalid data",
                details : validation.error.format()
            })
        }
        else{
        reply.send("db updated successfully");
        }
    });
}



