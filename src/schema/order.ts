import { z } from "zod";

const OrderLineItemSchema = z.object({
    appliedDiscount: z.boolean(),
    finalPrice: z.number(),
    price: z.number(),
    productId: z.string(),
    quantity: z.number(),
    shopId: z.string()
});

const OrderSchema = z.object({
    status: z.string(),
    paymentUrl: z.string(),
    failureReason: z.string(),
    orderLineItemList: z.array(OrderLineItemSchema),
    orderNumber: z.string(),
    totalPrice: z.number(),
    createdAt: z.string(),
    userId: z.string()
});

const OrderResponseSchema = z.object({
    code: z.number(),
    data: OrderSchema,
    message: z.string()
});

const OrderListResponseSchema = z.object({
    code: z.number(),
    data: z.array(OrderSchema),
    message: z.string()
});

const CheckOrderInputSchema = z.object({
    orderNumber: z.string(),
    timestamp: z.number()
});

export type OrderLineItem = z.infer<typeof OrderLineItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderResponse = z.infer<typeof OrderResponseSchema>;
export type OrderListResponse = z.infer<typeof OrderListResponseSchema>;
export type CheckOrderInput = z.infer<typeof CheckOrderInputSchema>;
