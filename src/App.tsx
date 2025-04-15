import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
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
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingComponent />}>
        <Routes>
          {/* <Route
        path="/login"
        element={isLogin ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isLogin ? <Navigate to="/" replace /> : <Register />}
      /> */}
          <Route path="/" element={<MainLayout />}>
            {/* <Route index element={<Home />} />
        <Route path="/:page" element={<PageRender />} />
        <Route path="/:page/:id" element={<PageRender />} /> */}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
