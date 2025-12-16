import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { createCategorySchema , getCategorySchema , patchCategorySchema, deleteCategorySchema } from "../schemas/categories";
import { id } from "zod/v4/locales";

const prisma = new PrismaClient();

export const categoryroutes : FastifyPluginAsync = async (fastify,_optioins) =>{
    fastify.post("/categories",{
        preHandler : [(fastify as any).authenticate]},async (request:FastifyRequest<{
            Body : {
                name : string,
                type: "INCOME" | "EXPENSE"
            }
        }> ,reply)=>{
            
            const {name,type} = request.body;
            const userid = (request.user as any).userId;
           

            const category = await prisma.categories.create({
                data : {
                    name,
                    type,
                    userId : userid
                }
            })
            const validation = createCategorySchema.safeParse(category);
            console.log("validation", validation)
            if(!validation.success){
                return reply.code(400).send({
                    error : validation.error.format(),
                })
                
            }
            reply.send("Databse entry created"+category.type + " " + category.name)


        }
    )
    fastify.get("/categories",{preHandler : [(fastify as any).authenticate]},async(request:FastifyRequest,reply)=>{
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
        if(!category){
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

    })

    fastify.patch('/categories/:id',{preHandler : [(fastify as any).authenticate]},async (request:FastifyRequest,reply)=>{
        const categoryid = (request.params as any).id;
        const userId = (request.user as any).userId;
        const category = await prisma.categories.updateMany({
            where : {
                id : categoryid,
            },
            data : {
                name : (request.body as any).name,
                type : (request.body as any).type
            }

        })
        const validation = patchCategorySchema.safeParse(request.body);
        if(!validation.success){
            return reply.code(400).send({
                error : "Invalid data",
                details : validation.error.format()
            })
        }
        else{
            reply.send("Category updated successfully")
        }
    })

    fastify.delete('/categories/:id',{preHandler : [(fastify as any).authenticate]},async (request:FastifyRequest,reply)=>{
        const categoryid = (request.params as any).id;
        const userId = (request.user as any).userId;
        const category = await prisma.categories.deleteMany({
            where : {
                id : categoryid,
            }
        })
        if(category.count === 0){
            return reply.code(404).send({
                error : "Category not found !!!!"
            })
        } 
        const validation = deleteCategorySchema.safeParse(request.params);
        if(!validation.success){
            return reply.code(400).send({
                error : "Invalid data",
                details : validation.error.format()
            })
        }
        else{
        reply.send("Category deleted successfully");
        }
    });
}