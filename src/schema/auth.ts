import { z } from "zod";

// UUID Schema
const UUIDSchema = z.string().uuid();

// Payload schemas
export const LoginPayloadSchema = z.object({
  username: z
    .string()
    .min(6, "Tên đăng nhập phải có ít nhất 6 ký tự")
    .max(10, "Tên đăng nhập không được quá 10 ký tự")
    .regex(/^[a-zA-Z0-9]+$/, "Tên đăng nhập không được chứa ký tự đặc biệt"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const RegisterPayloadSchema = z.object({
  username: z
    .string()
    .min(6, "Tên đăng nhập phải có ít nhất 6 ký tự")
    .max(10, "Tên đăng nhập không được quá 10 ký tự")
    .regex(/^[a-zA-Z0-9]+$/, "Tên đăng nhập không được chứa ký tự đặc biệt"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  phoneNumber: z.string().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ"),
});

// Login response schemas
const LoginSuccessResponseSchema = z.object({
  code: z.number(),
  result: z.object({
    token: z.string(),
    expiryTime: z.string(),
  }),
});

const UnauthenticatedErrorResponseSchema = z.object({
  code: z.number(),
  message: z.literal("Unauthenticated"),
});

const UserNotExistedErrorResponseSchema = z.object({
  code: z.number(),
  message: z.literal("User not existed"),
});

const LoginResponseSchema = z.union([
  LoginSuccessResponseSchema,
  UnauthenticatedErrorResponseSchema,
  UserNotExistedErrorResponseSchema,
]);

// Register response schemas
const PermissionSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const RoleSchema = z.object({
  name: z.string(),
  description: z.string(),
  permissions: z.array(PermissionSchema),
});

const RegisterSuccessResponseSchema = z.object({
  code: z.number(),
  result: z.object({
    id: z.string().uuid(),
    username: z.string(),
    status: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    profileId: z.string().uuid(),
    roles: z.array(RoleSchema),
  }),
});

const RegisterErrorResponseSchema = z.object({
  code: z.number(),
  result: z.object({
    phoneNumber: z.string().optional(),
    email: z.string().optional(),
    username: z.string().optional(),
  }),
});

const RegisterResponseSchema = z.union([
  RegisterSuccessResponseSchema,
  RegisterErrorResponseSchema,
]);

// Other schemas
const IntrospectPayloadSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

const IntrospectResponseSchema = z.object({
  valid: z.boolean(),
  userId: UUIDSchema,
  username: z.string(),
  scope: z.string(),
});

const MyInfoResponseSchema = z.object({
  userId: UUIDSchema,
  username: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  phoneNumber: z.string(),
});

const DeleteAccountResponseSchema = z.object({
  success: z.boolean(),
});

// Export types
export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterPayload = z.infer<typeof RegisterPayloadSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type IntrospectPayload = z.infer<typeof IntrospectPayloadSchema>;
export type IntrospectResponse = z.infer<typeof IntrospectResponseSchema>;
export type MyInfoResponse = z.infer<typeof MyInfoResponseSchema>;
export type DeleteAccountResponse = z.infer<typeof DeleteAccountResponseSchema>;
export type LoginSuccessResponse = z.infer<typeof LoginSuccessResponseSchema>;
export type UnauthenticatedErrorResponse = z.infer<
  typeof UnauthenticatedErrorResponseSchema
>;
export type UserNotExistedErrorResponse = z.infer<
  typeof UserNotExistedErrorResponseSchema
>;
export type RegisterSuccessResponse = z.infer<
  typeof RegisterSuccessResponseSchema
>;
export type RegisterErrorResponse = z.infer<typeof RegisterErrorResponseSchema>;
export type Permission = z.infer<typeof PermissionSchema>;
export type Role = z.infer<typeof RoleSchema>;

// Export schemas
export {
  DeleteAccountResponseSchema,
  IntrospectPayloadSchema,
  IntrospectResponseSchema,
  LoginResponseSchema,
  LoginSuccessResponseSchema,
  MyInfoResponseSchema,
  PermissionSchema,
  RegisterErrorResponseSchema,
  RegisterResponseSchema,
  RegisterSuccessResponseSchema,
  RoleSchema,
  UnauthenticatedErrorResponseSchema,
  UserNotExistedErrorResponseSchema,
};
