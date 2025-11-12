import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().optional().default("4000"),
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(8),
});

export const env = envSchema.parse(process.env);
