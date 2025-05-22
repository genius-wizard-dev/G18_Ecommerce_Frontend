import { z } from "zod";

export const DiscountDataSchema = z.object({
    _id: z.string(),
    shop: z.string(),
    name: z.string(),
    code: z.string(),
    start_time: z.any(),
    expiry_time: z.any(),
    discount_type: z.string(),
    discount_value: z.number(),
    min_price_product: z.number(),
    quantity: z.number(),
    quantity_per_user: z.number(),
    used_user_list: z.array(z.string()),
    applied_product_type: z.string(),
    applied_product_list: z.array(z.string()),
    is_private: z.boolean(),
    is_active: z.boolean()
});

export const DiscountResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(DiscountDataSchema),
    message: z.string()
});

export const ApplyDiscountSchema = z.object({
    userId: z.string(),
    discountId: z.string(),
    cartId: z.string(),
    productIdList: z.array(z.string())
});

export const CreateDiscountInputSchema = z.object({
    shop: z.string(),
    name: z.string(),
    code: z.string(),
    start_time: z.string(),
    expiry_time: z.string(),
    discount_type: z.string(),
    discount_value: z.number(),
    min_price_product: z.number(),
    quantity: z.number(),
    quantity_per_user: z.number(),
    applied_product_type: z.string(),
    applied_product_list: z.array(z.string())
});

export const UpdateDiscountInputSchema = z.object({
    discountId: z.string(),
    data: CreateDiscountInputSchema
});

export const DeleteDiscountInputSchema = z.object({
    discountId: z.string(),
    shopId: z.string()
});

export const DeleteDiscountResponseSchema = z.object({
    message: z.string(),
    code: z.number()
});

export type DicountResponse = z.infer<typeof DiscountResponseSchema>;
export type ApplyDiscountInput = z.infer<typeof ApplyDiscountSchema>;
export type Discount = z.infer<typeof DiscountDataSchema>;
export type CreateDiscountInput = z.infer<typeof CreateDiscountInputSchema>;
export type UpdateDiscountInput = z.infer<typeof UpdateDiscountInputSchema>;
export type DeleteDiscountResponse = z.infer<typeof DeleteDiscountResponseSchema>;
export type DeleteDiscountInput = z.infer<typeof DeleteDiscountInputSchema>;
