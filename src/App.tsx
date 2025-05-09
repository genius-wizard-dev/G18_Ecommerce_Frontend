import { Suspense, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AuthLayout from "./components/layout/AuthLayout";
import MainLayout from "./components/layout/MainLayout";
import { getAccessToken } from "./lib/storage";
import CartPage from "./pages/cart";
import HomePage from "./pages/home";
import Login from "./pages/login";
import Products from "./pages/products";
import Profile from "./pages/profile";
import Register from "./pages/register";
import { store } from "./redux/store";

const LoadingComponent = () => (
  <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
    <div className="text-lg font-semibold text-gray-700 animate-pulse">
      Đang tải...
    </div>
    <div className="mt-2 text-sm text-gray-500 animate-fade-in">
      Vui lòng chờ trong giây lát
    </div>
  </div>
);

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setIsLogin(true);
    }
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<LoadingComponent />}>
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

            {/* Route với MainLayout bao quanh các route con */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<Products />} />
              <Route path="profile" element={<Profile />} />
              <Route path="cart" element={<CartPage />} />
              {/* Các route con khác sẽ được thêm vào đây */}
              {/* <Route path="/:page" element={<PageRender />} />
              <Route path="/:page/:id" element={<PageRender />} /> */}
            </Route>
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
