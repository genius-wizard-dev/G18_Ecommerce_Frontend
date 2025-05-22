import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AuthLayout from "./components/layout/AuthLayout";
import MainLayout from "./components/layout/MainLayout";
import { getAccessToken } from "./lib/storage";
import CartPage from "./pages/cart";
import Dashboard from "./pages/dashboard/dashboard";
import HomePage from "./pages/home";
import Login from "./pages/login";
import ProductDetails from "./pages/product.details";
import ProductStats from "./pages/product.stats";
import ProductCategoryPage from "./pages/products.category";
import Profile from "./pages/profile";
import Register from "./pages/register";
import RegisterShop from "./pages/register-shop";
import BrandShop from "./pages/shop/BrandShop";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { getAccountInfo } from "./redux/thunks/account";
import { getAllAddress } from "./redux/thunks/address";
import { getCart } from "./redux/thunks/cart";
import { getOrderList, removeOrderById } from "./utils/handleOrderList";
import api from "./lib/axios/api.service";
import { CheckOrderInput, Order, OrderResponse } from "./schema/order";
import { ENDPOINTS } from "./lib/axios/endpoint";
import { setPaymentUrl } from "./redux/slices/orderSlice";
import { getProfile } from "./redux/thunks/profile";

const LoadingComponent = () => (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-700 animate-pulse">Đang tải....</div>
        <div className="mt-2 text-sm text-gray-500 animate-fade-in">Vui lòng chờ trong giây lát</div>
    </div>
);

function App() {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { account, isLoading: isAccountLoading } = useAppSelector((state) => state.account);
    const { profile, isLoading: isProfileLoading } = useAppSelector((state) => state.profile);
    const { trigger } = useAppSelector((state) => state.order);

    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            dispatch(getAccountInfo()).then(() => {
                setIsLogin(true);
            });
        }
    }, [dispatch]);

    useEffect(() => {
        if (account?.id) {
            dispatch(getProfile(account.id));
        }
    }, [dispatch, account]);

    useEffect(() => {
        if (profile?.id) {
            dispatch(getAllAddress(profile.id));
            dispatch(getCart(profile.id));
        }
    }, [dispatch, profile]);

    useEffect(() => {
        const orderList: CheckOrderInput[] = getOrderList();
        let timerId = null;
        if (orderList.length > 0) {
            timerId = setInterval(() => {
                console.log(orderList);
                Promise.allSettled(
                    orderList.map(({ orderNumber }) =>
                        api.get<OrderResponse>(ENDPOINTS.ORDER.GET_ORDER_BY_ORDER_NUMBER(orderNumber))
                    )
                ).then((data) => {
                    const createdPaymentList: string[] = [];
                    const paymentUrlList: string[] = [];
                    data.forEach((result) => {
                        if (result.status === "fulfilled") {
                            const order: Order = result.value.data;

                            if (order.status === "CREATED_PAYMENT") {
                                createdPaymentList.push(order.orderNumber);
                                paymentUrlList.push(order.paymentUrl);
                            }
                        }
                    });

                    dispatch(setPaymentUrl(paymentUrlList[0]));
                    removeOrderById(createdPaymentList);
                });
            }, 3000);
        } else {
            if (timerId) clearInterval(timerId);
        }

        return () => {
            if (timerId) clearInterval(timerId);
        };
    }, [trigger]);

    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingComponent />}>
                {isProfileLoading || isAccountLoading ? (
                    <LoadingComponent />
                ) : (
                    <Routes>
                        <Route element={<AuthLayout />}>
                            <Route path="login" element={isLogin ? <Navigate to="/" replace /> : <Login />} />
                            <Route path="register" element={isLogin ? <Navigate to="/" replace /> : <Register />} />
                        </Route>

                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<HomePage />} />
                            <Route path="product/:id" element={<ProductDetails />} />
                            <Route path="category/:categoryId" element={<ProductCategoryPage />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="cart" element={<CartPage />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="cart" element={<CartPage />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="register-shop" element={<RegisterShop />} />
                            <Route path="brand-shop" element={<BrandShop />} />
                            <Route path="stats-shop" element={<ProductStats />} />
                        </Route>
                    </Routes>
                )}
            </Suspense>
            <Toaster position="top-right" richColors closeButton />
        </BrowserRouter>
    );
}

export default App;
