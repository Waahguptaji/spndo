import z from "zod";

export const createReminderSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  note: z.string().max(500, "Note too long").optional(),
  due_at: z.string().datetime("Invalid date format"),
  repeat: z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY"], {
    errorMap: () => ({ message: "Invalid repeat value" }),
  }),
  is_done: z.boolean().default(false),
});
