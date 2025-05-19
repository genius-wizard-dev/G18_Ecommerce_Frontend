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

export type DicountResponse = z.infer<typeof DiscountResponseSchema>;
export type ApplyDiscountInput = z.infer<typeof ApplyDiscountSchema>;
export type Discount = z.infer<typeof DiscountDataSchema>;
