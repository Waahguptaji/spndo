import {z} from "zod";

export const userSchema = z.object({
    id : z.string().cuid(),
    email : z.string().email("Invalid email format"),
    phone :z.string().min(10,"Phone number must be at least 10 characters").max(15,"Phone number must be at most 15 characters")||null,
    profile_data:z.object({
        name : z.string().min(2,"Name must be at least 2 character").max(100,"Name must be at most 100 characters") || null,
        address : z.string().max(100,"Address must be at most 100 character")
    })
});
export const profileDataSchema = z.object({
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().min(10,"Phone number must be at least 10 characters").max(15,"Phone number must be at most 15 characters").optional(),
    profile_data: z.object({
        name: z.string().min(2,"Name must be at least 2 character").max(100,"Name must be at most 100 characters").optional(),
        address:z.string().max(100,"Address must be at most 100 character").optional()
    }).optional()
})
export type User = z.infer<typeof userSchema>;
export type ProfileData = z.infer<typeof profileDataSchema>;