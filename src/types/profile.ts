import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().nullable(),
  birthday: z.string().nullable(),
  address: z.string().nullable(),
  avatar: z.string().nullable(),
  isShop: z.boolean(),
});

export const ProfileResponseSchema = z.object({
  code: z.number(),
  result: ProfileSchema,
});

export type Profile = z.infer<typeof ProfileSchema>;
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
