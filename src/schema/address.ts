import { z } from "zod";

const AddressTypeSchema = z.enum(["HOME", "WORK", "OTHER"]);
const UUIDSchema = z.string().uuid();

const CreateAddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  detail: z.string().min(1, "Detail is required"),
  ward: z.string().min(1, "Ward is required"),
  district: z.string().min(1, "District is required"),
  type: AddressTypeSchema,
  phoneShip: z.string().min(1, "PhoneShip is required"),
});

const AddressSchema = z.object({
  id: UUIDSchema,
  profileId: UUIDSchema,
  street: z.string(),
  ward: z.string(),
  district: z.string(),
  city: z.string(),
  detail: z.string(),
  type: AddressTypeSchema,
  isDefault: z.boolean(),
  phoneShip: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const AddressResponseSchema = z.object({
  code: z.number(),
  result: z.array(AddressSchema),
});

const CreateAddressResponseSchema = z.object({
  code: z.number(),
  result: AddressSchema,
});

const GetAllAddressesResponseSchema = z.object({
  code: z.number(),
  result: z.array(AddressSchema),
});

const SetDefaultAddressResponseSchema = z.object({
  success: z.boolean(),
  addressId: UUIDSchema,
});

const UpdateAddressTypeResponseSchema = z.object({
  addressId: UUIDSchema,
  type: AddressTypeSchema,
});

const DeleteAddressResponseSchema = z.object({
  code: z.number(),
  success: z.boolean(),
});

export type CreateAddress = z.infer<typeof CreateAddressSchema>;
export type DeleteResponseAddress = z.infer<typeof DeleteAddressResponseSchema>;
export type UpdateAddress = z.infer<typeof CreateAddressSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type AddressResponse = z.infer<typeof AddressResponseSchema>;
export type CreateAddressResponse = z.infer<typeof CreateAddressResponseSchema>;
export type UpdateAddressResponse = z.infer<typeof CreateAddressResponseSchema>;
export type GetAllAddressesResponse = z.infer<
  typeof GetAllAddressesResponseSchema
>;
export type SetDefaultAddressResponse = z.infer<
  typeof SetDefaultAddressResponseSchema
>;
export type UpdateAddressTypeResponse = z.infer<
  typeof UpdateAddressTypeResponseSchema
>;

export interface Province {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  districts?: District[];
}

export interface District {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
  wards?: Ward[];
}

export interface Ward {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  district_code: number;
}

export interface LocationState {
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  selectedProvince: Province | null;
  selectedDistrict: District | null;
  selectedWard: Ward | null;
  isLoading: boolean;
  error: string | null;
}
