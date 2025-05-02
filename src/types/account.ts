import { z } from "zod";

export const PermissionSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const RoleSchema = z.object({
  name: z.string(),
  description: z.string(),
  permissions: z.array(PermissionSchema),
});

export const ResultSchema = z.object({
  id: z.string(),
  username: z.string(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  profileId: z.null(),
  roles: z.array(RoleSchema),
});

export const AccountSchema = z.object({
  code: z.number(),
  result: ResultSchema,
});

// You can still derive your TypeScript types from the schemas if needed
export type Permission = z.infer<typeof PermissionSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type Result = z.infer<typeof ResultSchema>;
export type Account = z.infer<typeof AccountSchema>;
