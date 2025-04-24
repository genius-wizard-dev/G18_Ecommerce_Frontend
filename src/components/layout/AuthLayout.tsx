import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-tl from-red-400 to-orange-300 flex items-center justify-center p-4 ">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
