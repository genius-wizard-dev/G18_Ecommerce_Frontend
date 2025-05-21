import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { Order, OrderLineItem } from "@/schema/order";
import { ProductInput, ProductResponse } from "@/schema/product";
import { useEffect, useState } from "react";

export default function DetailsOrderModal({
    handleToggleDisplayDetailsOrderModal,
    currentOrder
}: {
    currentOrder: Order;
    handleToggleDisplayDetailsOrderModal: () => void;
}) {
    interface ProductItem {
        shopId: string;
        productId: string;
        name: string;
        price: number;
        image: string;
        quantity: number;
    }

    const [products, setProducts] = useState<ProductItem[]>([]);

    useEffect(() => {
        const finalPriceParams: any = {};
        const quantityParams: any = {};
        Promise.allSettled(
            currentOrder.orderLineItemList.map((orderLineItem: OrderLineItem) => {
                finalPriceParams[orderLineItem.productId] = orderLineItem.finalPrice;
                quantityParams[orderLineItem.productId] = orderLineItem.quantity;

                return api.get<ProductResponse>(ENDPOINTS.PRODUCT.GET_BY_ID(orderLineItem.productId));
            })
        ).then((data) => {
            setProducts(
                data.reduce((arr: any, res) => {
                    const status = res.status;

                    if (status === "fulfilled") {
                        const product = res.value.data as ProductInput;

                        return [
                            ...arr,
                            {
                                shopId: product.shopId,
                                productId: product._id,
                                name: product.name,
                                price: finalPriceParams[product._id],
                                image: product.thumbnailImage,
                                quantity: quantityParams[product._id]
                            }
                        ];
                    }

                    return arr;
                }, [])
            );
        });
    }, [JSON.stringify(currentOrder)]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-800/70">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Product List</h2>
                    <button
                        className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
                        onClick={handleToggleDisplayDetailsOrderModal}
                    >
                        &times;
                    </button>
                </div>
                <ul className="space-y-3">
                    {products.map((product: ProductItem) => (
                        <li key={product.productId} className="border p-3 rounded-lg flex justify-between items-center">
                            <img src={product.image} alt="product" className="h-12 w-12 rounded-full object-cover" />
                            <span className="font-semibold">{product.name}</span>
                            <span className="font-semibold text-gray-500">{`X ${product.quantity}`}</span>
                            <span className="font-medium text-red-600">{product.price}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
