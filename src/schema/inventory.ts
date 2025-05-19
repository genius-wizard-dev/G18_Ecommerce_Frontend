import { z } from "zod";

// Schema cho dữ liệu kho hàng (inventory)
export const InventorySchema = z.object({
  _id: z.string().optional(),
  product_id: z.string().min(1, "ID sản phẩm không được để trống"),
  product_name: z.string().min(1, "Tên sản phẩm không được để trống"),
  shop_id: z.string().min(1, "ID cửa hàng không được để trống"),
  total_quantity: z.number().nonnegative("Số lượng không được âm"),
});

// Schema cho response của API
export const InventoryResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: InventorySchema,
});

// Schema cho danh sách inventory
export const InventoryListSchema = z.object({
  inventories: z.array(InventorySchema),
  total: z.number().nonnegative(),
  page: z.number().positive(),
  pages: z.number().nonnegative(),
});

// Schema cho response của API danh sách inventory
export const InventoryListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: InventoryListSchema,
});

// Các type export
export type Inventory = z.infer<typeof InventorySchema>;
export type InventoryResponse = z.infer<typeof InventoryResponseSchema>;
export type InventoryListResponse = z.infer<typeof InventoryListResponseSchema>;
