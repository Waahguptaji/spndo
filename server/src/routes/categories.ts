import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { createCategorySchema , getCategorySchema , patchCategorySchema, deleteCategorySchema } from "../schemas/categories";

const prisma = new PrismaClient();

export const categoryRoutes : FastifyPluginAsync = async (fastify,_options) =>{
    fastify.post("/categories",{
        preHandler : [(fastify as any).authenticate]},async (request:FastifyRequest<{
            Body : {
                name : string,
                type: "INCOME" | "EXPENSE"
            }
        }> ,reply)=>{
            try {
                const {name,type} = request.body;
                const userId = (request.user as any).userId;
                
                // Validate request body before database operation
                const validation = createCategorySchema.safeParse({
                    name,
                    type,
                    userId
                });
                
                if(!validation.success){
                    return reply.code(400).send({
                        error : validation.error.format(),
                    })
                }

                const category = await prisma.categories.create({
                    data : {
                        name,
                        type,
                        userId
                    }
                })
                
                reply.send("Database entry created: " + category.type + " - " + category.name)
            } catch (error) {
                console.error("Error creating category:", error);
                return reply.code(500).send({ error: "Failed to create category" });
            }
        }
    )
    fastify.get("/categories",{preHandler : [(fastify as any).authenticate]},async(request:FastifyRequest,reply)=>{
        try {
            const userId = (request.user as any).userId;
            const category = await prisma.categories.findMany({
                where : {
                    userId : userId
                },
                select : {
                    userId : true,
                    name : true,
                    type : true,
                    id : true,
                    created_at : true,
                    user  : {
                        select: {
                            id : true,
                            email : true,
                            phone : true,
                            profile_data : true
                        }
                    }
                }
            })
            
            if(category.length === 0){
                return reply.code(404).send({error : "No categories found for this user"})
            }
            
            const validation = getCategorySchema.array().safeParse(category);
            if(!validation.success){
                return reply.code(400).send({
                    error : "Category data is invalid",
                    details : validation.error.format()
                })
            }   
            reply.send(category);
        } catch (error) {
            console.error("Error fetching categories:", error);
            return reply.code(500).send({ error: "Failed to fetch categories" });
        }
    })

    fastify.patch('/categories/:id',{ preHandler: [(fastify as any).authenticate] },async (request, reply) => {
        try {
            const validation = patchCategorySchema.safeParse(request.body);
            if (!validation.success) {
                return reply.code(400).send({
                    error: 'Invalid data',
                    details: validation.error.format(),
                });
            }

            const { name, type } = validation.data;
            const { id } = request.params as { id: string };
            const userId = (request.user as any).userId;

            const updated = await prisma.categories.updateMany({
                where: {
                    id,
                    userId,
                },
                data: { name, type },
            });

            if (updated.count === 0) {
                return reply.code(404).send({
                    error: 'Category not found or not authorized',
                });
            }

            return reply.send({ message: 'Category updated successfully' });
        } catch (error) {
            console.error("Error updating category:", error);
            return reply.code(500).send({ error: "Failed to update category" });
        }
    }
    );


    fastify.delete('/categories/:id',{ preHandler: [(fastify as any).authenticate] },async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const userId = (request.user as any).userId;
            
            // Validate parameters before database operation
            const parsedParams = deleteCategorySchema.safeParse({ id });
            if (!parsedParams.success) {
                return reply.code(400).send({
                    error: 'Invalid category id',
                    details: parsedParams.error.format(),
                });
            }

            const result = await prisma.categories.deleteMany({
                where: {
                    id,
                    userId,
                },
            });

            if (result.count === 0) {
                return reply.code(404).send({
                    error: 'Category not found or not authorized',
                });
            }

            return reply.send({ message: 'Category deleted successfully' });
        } catch (error) {
            console.error("Error deleting category:", error);
            return reply.code(500).send({ error: "Failed to delete category" });
        }
    })
}