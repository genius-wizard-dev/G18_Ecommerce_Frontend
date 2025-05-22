import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { CartResponse } from "@/schema/cart";
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

      localStorage.setItem("added", (Math.random() + 1).toString());

      return result;
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      throw error;
    }
  },
});

export const getCart = tool({
  description: "Lấy giỏ hàng của người dùng",
  parameters: z.object({
    userId: z.string(),
  }),
  execute: async ({ userId }) => {
    try {
      const cart = await api.get<CartResponse>(ENDPOINTS.CART.GET_CART(userId));

      if (
        !cart.data ||
        !cart.data.cartItems ||
        !Array.isArray(cart.data.cartItems)
      ) {
        return { items: [], total: 0 };
      }

      const productsPromises = cart.data.cartItems.map(async (item) => {
        const product = await api.get<ProductResponse>(
          ENDPOINTS.PRODUCT.GET_BY_ID(item.productId)
        );
        return {
          id: product.data._id,
          name: product.data.name,
          price: product.data.price,
          quantity: item.quantity,
          total: item.total,
          cartItemId: item.id,
        };
      });

      const products = await Promise.all(productsPromises);

      const cartTotal = products.reduce((sum, item) => sum + item.total, 0);

      return {
        items: products,
        total: cartTotal,
      };
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      return { items: [], total: 0, error: "Không thể lấy thông tin giỏ hàng" };
    }
  },
});

export const updateCartItem = tool({
  description:
    "Cập nhật số lượng sản phẩm trong giỏ hàng yêu cầu lấy danh sách sản phẩm trong giỏ hàng trước",
  parameters: z.object({
    cartItemId: z.string(),
    quantity: z.number(),
  }),
  execute: async ({ cartItemId, quantity }) => {
    try {
      const update = await api.put<{
        code: number;
        message: string;
        data: any;
      }>(ENDPOINTS.CART.UPDATE_QUANTITY(cartItemId), {
        quantity,
      });

      return update;
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      return {
        code: 500,
        message: "Không thể cập nhật số lượng sản phẩm trong giỏ hàng",
        data: null,
      };
    }
  },
});

export const deleteCartItem = tool({
  description:
    "Xóa sản phẩm khỏi giỏ hàng yêu cầu lấy danh sách sản phẩm trong giỏ hàng trước",
  parameters: z.object({
    cartItemId: z.string(),
  }),
  execute: async ({ cartItemId }) => {
    try {
      const remove = await api.delete<{
        code: number;
        message: string;
        data: any;
      }>(ENDPOINTS.CART.DELETE_CART_ITEM(cartItemId));

      return remove;
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      return {
        code: 500,
        message: "Không thể xóa sản phẩm khỏi giỏ hàng",
        data: null,
      };
    }
  },
});
