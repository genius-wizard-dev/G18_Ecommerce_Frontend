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
      const product = await api
        .get<ProductResponse>(ENDPOINTS.PRODUCT.GET_BY_ID(order.productId))
        .catch(() => null);
      if (product) {
        const data = {
          id: product.data._id,
          name: product.data.name,
          shopId: product.data.shopId,
          price: product.data.price,
          total: order.total,
        };
        productsWithTotal.push(data);
      }
    }

    return productsWithTotal;
  },
});

export const addProductToCart = tool({
  description: "Thêm sản phẩm vào giỏ hàng",
  parameters: z.object({
    productId: z.string(),
    quantity: z.number(),
    userId: z.string(),
  }),
  execute: async ({ productId, quantity = 1, userId }) => {
    try {
      const product = await api.get<ProductResponse>(
        ENDPOINTS.PRODUCT.GET_BY_ID(productId)
      );
      if (product.success === false) {
        throw new Error(product.message);
      }
      // Demo: Thực tế sẽ gọi API thêm vào giỏ hàng
      const result = await api.post<{
        code: number;
        message: string;
        data: any;
      }>(ENDPOINTS.CART.ADD_TO_CART, {
        productId,
        quantity,
        price: product.data.price,
        shopId: product.data.shopId,
        userId: userId,
      });

      return result;
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      throw error;
    }
  },
});
