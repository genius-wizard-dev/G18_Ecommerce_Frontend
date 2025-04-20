import { z } from "zod";

const UUIDSchema = z.string().uuid();

const LoginPayloadSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

const LoginResponseSchema = z.object({
  code: z.number(),
  result: z.object({
    token: z.string(),
    refreshToken: z.string().optional(),
  })
});

const RegisterPayloadSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  phoneNumber: z.string().regex(/^\d{10,15}$/, "Số điện thoại không hợp lệ"),
});

const RegisterResponseSchema = z.object({
  userId: UUIDSchema,
  username: z.string(),
  email: z.string().email(),
});

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

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterPayload = z.infer<typeof RegisterPayloadSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type IntrospectPayload = z.infer<typeof IntrospectPayloadSchema>;
export type IntrospectResponse = z.infer<typeof IntrospectResponseSchema>;
export type MyInfoResponse = z.infer<typeof MyInfoResponseSchema>;
export type DeleteAccountResponse = z.infer<typeof DeleteAccountResponseSchema>;

export const AuthSchemas = {
  LOGIN: { payload: LoginPayloadSchema, response: LoginResponseSchema },
  REGISTER: {
    payload: RegisterPayloadSchema,
    response: RegisterResponseSchema,
  },
  INTROSPECT: {
    payload: IntrospectPayloadSchema,
    response: IntrospectResponseSchema,
  },
  MY_INFO: { response: MyInfoResponseSchema },
  DELETE_ACCOUNT: { response: DeleteAccountResponseSchema },
  LOGOUT: { response: z.object({ success: z.boolean() }) },
  REFRESH: {
    response: z.object({
      token: z.string(),
      refreshToken: z.string().optional(),
    }),
  },
};
