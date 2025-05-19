import { z } from "zod";

export const ProductListDataSchema = z.object({
    products: z.any(),
    total: z.number(),
    page: z.number(),
    pages: z.number()
});

export const ProductListResponseSchema = z.object({
    success: z.boolean(),
    data: ProductListDataSchema,
    message: z.string()
});

export const ProductDataSchema = z.object({
    _id: z.string(),
    attribute: z.string(),
    category: z.string(),
    description: z.string(),
    images: z.array(z.string()),
    name: z.string(),
    price: z.number(),
    ratings: z.any(),
    shopId: z.string(),
    tags: z.array(z.string()),
    thumbnailImage: z.string()
});

export const ProductResponseSchema = z.object({
    success: z.boolean(),
    data: ProductDataSchema,
    message: z.string()
});

export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type ProductInput = z.infer<typeof ProductDataSchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
