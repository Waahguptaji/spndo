import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .min(10, "Phone number must be at least 10 characters")
  .max(15, "Phone number must be at most 15 characters");

const profileDataObjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters")
      .optional(),
    address: z
      .string()
      .trim()
      .max(100, "Address must be at most 100 characters")
      .optional(),
    city: z.string().trim().max(100).optional(),
    state: z.string().trim().max(100).optional(),
    pinCode: z.string().trim().max(20).optional(),
    image: z.string().optional(),
  })
  .passthrough();

export const userSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email("Invalid email format"),
  phone: phoneSchema.nullable(),
  profile_data: profileDataObjectSchema.nullable(),
});

export const profileDataSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  phone: phoneSchema.optional(),
  profile_data: profileDataObjectSchema.optional(),
});

export type User = z.infer<typeof userSchema>;
export type ProfileData = z.infer<typeof profileDataSchema>;
