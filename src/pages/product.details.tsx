import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart, CartItem, CartItemBody, CartItemInput } from "@/redux/slices/cartSlice";
import { addProductToCart } from "@/redux/thunks/cart";
import { getCurrentProduct } from "@/redux/thunks/product";
import { ProductInput, ProductResponse } from "@/schema/product";
import { Profile } from "@/schema/profile";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Product = {
    shopId: string;
    _id: string;
    name: string;
    description: string;
    price: number;
    ratings: {
        average: number;
        count: number;
    };
    thumbnailImage: string;
};

type ProductDetailsProps = {
    product: Product;
};

const ProductDetails = () => {
    const [quantity, setQuantity] = useState<number>(1);
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const { products } = useAppSelector((state) => state.product);
    const { profile } = useAppSelector((state) => state.profile);

    const handleAddToCart = (product: Product, profile: Profile) => {
        const cartItemInput: CartItemBody = {
            userId: profile.id,
            productId: product._id,
            quantity,
            price: product.price,
            shopId: product.shopId
        };

        dispatch(addProductToCart(cartItemInput));
    };

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const product = products.find((product?: Product) => product?._id === id);
        if (!product && id) {
            dispatch(getCurrentProduct(id)).then((data: any) => {
                setProduct(data.payload.data);
            });
        } else setProduct(product);
    }, [id]);

    return (
        product &&
        profile && (
            <div className="max-w-5xl mx-auto p-6 flex">
                <img
                    src={product.thumbnailImage}
                    alt={product.name}
                    className="w-60 rounded-xl shadow-md object-contain"
                />

                <div className="max-w-5xl mx-auto p-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                        <div className="text-xl text-green-600 font-semibold mb-2">${product.price.toFixed(2)}</div>

                        <div className="mb-4 text-yellow-500">
                            {"★".repeat(Math.floor(product.ratings.average))}
                            {"☆".repeat(5 - Math.floor(product.ratings.average))}
                            <span className="text-sm text-gray-500 ml-2">{product.ratings.average}</span>
                        </div>

                        <p className="text-gray-700 mb-6">{product.description}</p>

                        <div className="flex items-center gap-4 mb-6">
                            <label htmlFor="quantity" className="font-medium">
                                Quantity:
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-20 border rounded-lg px-3 py-1 text-center"
                            />
                        </div>

                        <button
                            onClick={() => handleAddToCart(product, profile)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ProductDetails;
