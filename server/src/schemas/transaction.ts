import { z } from "zod";

export const createTransactionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  amount: z.number().positive("Amount must be positive"),
  occurred_at: z.string().datetime("Invalid date format"), // ISO 8601 date string
  category_id: z.string().cuid("Invalid category ID"),
  type: z.enum(["INCOME", "EXPENSE"], {
    errorMap: () => ({ message: "Type must be INCOME or EXPENSE" }),
  }),
  note: z.string().max(500, "Note too long").optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
