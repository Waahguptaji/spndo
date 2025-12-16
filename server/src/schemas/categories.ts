import  {z} from "zod";
import { id } from "zod/v4/locales";

export const createCategorySchema = z.object({
    userId : z.string().cuid(),
    name:z.string().min(2,"Category name must be at least 2 characters").max(50,"Category name must be at most 50 characters"),
    type : z.enum(["INCOME","EXPENSE"],{
        required_error:"Category type is required",
        invalid_type_error:"Category type must be either INCOME or EXPENSE"
    }),
    
})
export const getCategorySchema = z.object({
    userId : z.string().cuid(),
    name:z.string().min(2,"Category name must be at least 2 characters").max(50,"Category name must be at most 50 characters"),
    type : z.enum(["INCOME","EXPENSE"],{
        required_error:"Category type is required",
        invalid_type_error:"Category type must be either INCOME or EXPENSE"
    }),
    id : z.string().cuid(),
    created_at : z.date(),
    user : z.object({
        id : z.string().cuid(),
        email : z.string().email(),
        phone : z.string().min(10).max(15),
        profile_data : z.any().nullable()
    })
})
export const patchCategorySchema = z.object({
    id : z.string().cuid(),
    name : z.string().min(2,"Category name must be at least 2 characters").max(50,"Category name must be at most 50 characters").optional(),
    type : z.enum(["INCOME","EXPENSE"],{
        required_error:"Category type is required",
        invalid_type_error:"Category type must be either INCOME or EXPENSE"
    }).optional()
})

export const deleteCategorySchema = z.object({
    id : z.string().cuid()
})

export type CreateCategory = z.infer<typeof createCategorySchema>;
export type GetCategory = z.infer<typeof getCategorySchema>;
export type PatchCategory = z.infer<typeof patchCategorySchema>;
export type DeleteCategory = z.infer<typeof deleteCategorySchema>;