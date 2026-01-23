
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { getBudgetSchema, putBudgetSchema } from "../schemas/budgets";
import { prisma } from "../lib/prisma";


export const budgetRoutes : FastifyPluginAsync = async (fastify,_optional) =>{
 
    fastify.get("/budgets/:month",{
        preHandler : [(fastify as any).authenticate]},async (request:FastifyRequest<{
            Params:{
                month: string
            }
        }>,reply)=>{
            try {

                const userId = (request.user as any).userId
                const {month} =request.params;
                // Convert month string (YYYY-MM) to DateTime (first day of the month)
                const monthDate = new Date(`${month}-01`);
                
                const validation = getBudgetSchema.safeParse({
                    userId,month
                });
                if(!validation.success){
                    return reply.code(400).send({
                        error : "Invalid request data",
                        details : validation.error.format(),
                    })
                }
                const budget = await prisma.budget.findMany({
                    where :{
                        userId : userId,
                        month : monthDate
                    }
                })
                reply.send("get data :" + JSON.stringify(budget));
            



            }catch (error){
                console.error("Error fetching budgets:", error);
            }

        }
    )
    fastify.put("/budgets/:month",{
        preHandler : [(fastify as any).authenticate]},async (request:FastifyRequest<{
            Params:{
                month:string
            },
            Body : {
                amount : number,
                categoryId : string
            }
        }>,reply)=>{
            try {
                const userId = (request.user as any).userId;
                const {month} = request.params;
                const {amount,categoryId} = request.body;
                
                // Convert month string (YYYY-MM) to DateTime (first day of the month)
                const monthDate = new Date(`${month}-01`);
            
                const validation = putBudgetSchema.safeParse({
                    userId,month,amount,categoryId
                    
                });
                if(!validation.success){

                    return reply.code(400).send({
                        error : "Invalid request data",
                        details : validation.error.format(),
                    })
                }
                
                // Verify that the category exists and belongs to the user
                const categoryExists = await prisma.categories.findFirst({
                    where: {
                        id: categoryId,
                        userId: userId
                    }
                });
                
                if (!categoryExists) {
                    return reply.code(404).send({
                        error: "Category not found",
                        message: "The specified category does not exist or does not belong to you"
                    });
                }
                    
                const budget = await prisma.budget.upsert({
                    where :{
                        userId_categoryId_month : {
                            userId : userId,
                            month : monthDate,
                            categoryId : categoryId
                        }
                    },
                    create : {
                        userId : userId,
                        month : monthDate,
                        amount : amount,
                        categoryId : categoryId     
                    },
                    update : {
                        amount : amount
                    }
                })
                reply.send("database entry created :" + JSON.stringify(budget));


            }catch(error){
                console.error("Error updating budget:", error);
            }

        }
            
    )
}


