import { z } from "zod";

// UUID Schema
const UUIDSchema = z.string().uuid();

// Permission Schema
const PermissionSchema = z.object({
  name: z.string(),
  description: z.string(),
});

// Role Schema
const RoleSchema = z.object({
  name: z.string(),
  description: z.string(),
  permissions: z.array(PermissionSchema),
});

// My Info Schema
const AccountSchema = z.object({
  id: UUIDSchema,
  username: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  phoneNumber: z.string(),
});

// Delete Account Schema
const DeleteAccountResponseSchema = z.object({
  success: z.boolean(),
});

const AccountResponseSchema = z.object({
  code: z.number(),
  result: AccountSchema,
});

// Export types
export type Account = z.infer<typeof AccountSchema>;
export type AccountResponse = z.infer<typeof AccountResponseSchema>;
export type DeleteAccountResponse = z.infer<typeof DeleteAccountResponseSchema>;
export type Permission = z.infer<typeof PermissionSchema>;
export type Role = z.infer<typeof RoleSchema>;
