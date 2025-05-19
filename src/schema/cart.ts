import { string, z } from "zod";

export const CartItemDataSchema = z.object({
    id: z.string(),
    shopId: z.string(),
    productId: z.string(),
    quantity: z.number(),
    price: z.number(),
    finalPrice: z.number(),
    appliedDiscount: z.boolean()
});

export const CartItemResponseSchema = z.object({
    code: z.number(),
    data: CartItemDataSchema,
    message: z.string()
});

export const CartDataSchema = z.object({
    id: z.string(),
    userId: z.string(),
    status: z.string(),
    discountId: z.string(),
    cartItems: z.array(z.any()),
    totalPrice: z.number()
});

export const CartResponseSchema = z.object({
    code: z.number(),
    data: CartDataSchema,
    message: z.string()
});

export const UpdateQuantitySchema = z.object({
    userId: z.string(),
    cartItemId: z.string(),
    quantity: z.number()
});

export const DeleteCartItemSchema = z.object({
    userId: z.string(),
    cartItemId: z.string()
});

export const CartItemInputSchema = z.object({
    id: z.string(),
    shopId: z.string(),
    productId: z.string(),
    quantity: z.number(),
    price: z.number(),
    finalPrice: z.number(),
    appliedDiscount: z.boolean()
});

export type CartItemInput = z.infer<typeof CartItemInputSchema>;
export type CartResponse = z.infer<typeof CartResponseSchema>;
export type CartItemResponse = z.infer<typeof CartItemResponseSchema>;
export type DeleteCartItemInput = z.infer<typeof DeleteCartItemSchema>;
export type UpdateQuantityInput = z.infer<typeof UpdateQuantitySchema>;
