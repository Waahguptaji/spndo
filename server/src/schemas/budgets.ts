import {z} from "zod";

export const getBudgetSchema = z.object({
    userId : z.string().cuid(),
    month : z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/,"Month must be in YYYY-MM format"),

})
export const putBudgetSchema = z.object({
    userId : z.string().cuid(),
    month : z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/,"Month must be in YYYY-MM format"),
    budgets : z.array(z.object({
        amount : z.number().min(0,"Amount must be at least 0"),
        categoryId : z.string().cuid(),
    })).min(1, "At least one budget entry is required")
})

export type GetBudget = z.infer<typeof getBudgetSchema>;