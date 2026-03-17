import {z} from 'zod';

export const postGoalSchema = z.object({
    userId : z.string().cuid(),
    title : z.string().min(1,"Title is required"),
    target_amount : z.number().min(0,"Amount must be at least 0"),
    deadline : z.date().refine((date) => date > new Date() ,{
        message : "DeadLine must be a future date"
    } ),
    status : z.enum(["active","completed","cancelled","paused"]).default("active")
})
export const getGoalSchema = z.object({
    userId : z.string().cuid()
})
export const patchGoatSchema = z.object({
    userId : z.string().cuid(),
    goalId : z.string().uuid(),
    title : z.string().min(1,"Title is required").optional(),
    target_amount : z.number().min(0,"Amount must be at least 0").optional(),
    deadline : z.date().refine((date)=> date > new Date(),{
        message : "Deadline must be a future date"
    }).optional(),
status : z.enum(["active","completed","cancelled","paused"]).optional()
})
export const deleteGoalSchema = z.object({
    userId : z.string().cuid(),
    goalId : z.string().uuid()
})
export type PostGoal = z.infer<typeof postGoalSchema>;