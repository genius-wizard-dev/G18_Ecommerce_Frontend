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
import Products from "./pages/products";
import Profile from "./pages/profile";
import Register from "./pages/register";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { getAccountInfo } from "./redux/thunks/account";
import { getAllAddress } from "./redux/thunks/address";
import { getProfile } from "./redux/thunks/profile";
import RegisterShop from "./pages/register-shop";

const LoadingComponent = () => (
  <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
    <div className="text-lg font-semibold text-gray-700 animate-pulse">
      Đang tải....
    </div>
    <div className="mt-2 text-sm text-gray-500 animate-fade-in">
      Vui lòng chờ trong giây lát
    </div>
  </div>
);

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { account, isLoading: isAccountLoading } = useAppSelector(
    (state) => state.account
  );
  const { profile, isLoading: isProfileLoading } = useAppSelector(
    (state) => state.profile
  );

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
    }
  }, [dispatch, profile]);
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingComponent />}>
        {isProfileLoading || isAccountLoading ? (
          <LoadingComponent />
        ) : (
          <Routes>
            <Route element={<AuthLayout />}>
              <Route
                path="login"
                element={isLogin ? <Navigate to="/" replace /> : <Login />}
              />
              <Route
                path="register"
                element={isLogin ? <Navigate to="/" replace /> : <Register />}
              />
            </Route>

            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<Products />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="profile" element={<Profile />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="register-shop" element={<RegisterShop/>}/>
            </Route>
          </Routes>
        )}
      </Suspense>
      <Toaster position="top-right" richColors closeButton />
    </BrowserRouter>
  );
}

export default App;
