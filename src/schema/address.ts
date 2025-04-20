import { z } from "zod";

const AddressTypeSchema = z.enum(["HOME", "WORK", "OTHER"]);
const UUIDSchema = z.string().uuid();

const CreateAddressPayloadSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  detail: z.string().min(1, "Detail is required"),
  type: AddressTypeSchema,
});

const AddressSchema = z.object({
  addressId: UUIDSchema,
  street: z.string(),
  city: z.string(),
  detail: z.string(),
  type: AddressTypeSchema,
  isDefault: z.boolean(),
});

const CreateAddressResponseSchema = z.object({
  addressId: UUIDSchema,
  profileId: UUIDSchema,
  street: z.string(),
  city: z.string(),
  detail: z.string(),
  type: AddressTypeSchema,
});

const GetAllAddressesResponseSchema = z.array(AddressSchema);

const SetDefaultAddressResponseSchema = z.object({
  success: z.boolean(),
  addressId: UUIDSchema,
});

const UpdateAddressTypeResponseSchema = z.object({
  addressId: UUIDSchema,
  type: AddressTypeSchema,
});

export type CreateAddressPayload = z.infer<typeof CreateAddressPayloadSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type CreateAddressResponse = z.infer<typeof CreateAddressResponseSchema>;
export type GetAllAddressesResponse = z.infer<
  typeof GetAllAddressesResponseSchema
>;
export type SetDefaultAddressResponse = z.infer<
  typeof SetDefaultAddressResponseSchema
>;
export type UpdateAddressTypeResponse = z.infer<
  typeof UpdateAddressTypeResponseSchema
>;

export const AddressSchemas = {
  CREATE: {
    payload: CreateAddressPayloadSchema,
    response: CreateAddressResponseSchema,
  },
  GET_ALL: { response: GetAllAddressesResponseSchema },
  SET_DEFAULT: { response: SetDefaultAddressResponseSchema },
  UPDATE_TYPE: { response: UpdateAddressTypeResponseSchema },
};
