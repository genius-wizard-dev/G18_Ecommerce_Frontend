import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { ProductListResponse, ProductResponse } from "@/schema/product";
import { tool } from "ai";
import { z } from "zod";

export const fetchProductByCategory = tool({
  description: "Lấy danh sách sản phẩm theo danh mục với số lượng",
  parameters: z.object({
    category: z.string(),
    limit: z.number().optional(),
  }),
  execute: async ({ category, limit = 10 }) => {
    const products = await api.get<ProductListResponse>(
      ENDPOINTS.PRODUCT.GET_BY_CATEGORY(category, limit)
    );
    return products;
  },
});

export const getTopOrder = tool({
  description: "Lấy top sản phẩm được đặt hàng nhiều nhất",
  parameters: z.object({
    limit: z.number().optional(),
  }),
  execute: async ({ limit = 10 }) => {
    const orders = await api.get<{
      code: number;
      message: string;
      data: Array<{
        productId: string;
        total: number;
      }>;
    }>(ENDPOINTS.ORDER.GET_TOP_ORDER(limit));
    if (orders.code !== 1000) {
      throw new Error(orders.message);
    }

    const productsWithTotal = [];

    for (const order of orders.data) {
      const product = await api.get<ProductResponse>(
        ENDPOINTS.PRODUCT.GET_BY_ID(order.productId)
      ).catch(() => null);

      if (product) {
        productsWithTotal.push({
          product: product,
          total: order.total,
        });
      }
    }

    return productsWithTotal;
  },
});
