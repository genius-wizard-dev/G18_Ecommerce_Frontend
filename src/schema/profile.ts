import { z } from "zod";

const UUIDSchema = z.string().uuid();

export const ProfileSchema = z.object({
  id: UUIDSchema,
  userId: UUIDSchema,
  email: z.string().email(),
  phoneNumber: z.string(),
  fullName: z.string(),
  shopId: UUIDSchema,
  isShop: z.boolean(),
  birthDay: z.any(),
});

export const ProfileResponseSchema = z.object({
  code: z.number(),
  result: ProfileSchema,
});

// const UpdateProfilePayloadSchema = z.object({
//   avatar: z.string().url("Invalid URL").optional(),
//   displayName: z.string().min(1, "Display name is required").optional(),
//   birthDay: z
//     .string()
//     .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
//     .optional(),
// });

// const UpdateProfileResponseSchema = z.object({
//   profileId: UUIDSchema,
//   avatar: z.string().url().optional(),
//   displayName: z.string(),
//   birthDay: z.string().optional(),
// });

const RegisterShopResponseSchema = z.object({
  shopId: UUIDSchema,
  profileId: UUIDSchema,
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

// export type UpdateProfilePayload = z.infer<typeof UpdateProfilePayloadSchema>;
// export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;
export type RegisterShopResponse = z.infer<typeof RegisterShopResponseSchema>;

export type Profile = z.infer<typeof ProfileSchema>;
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
