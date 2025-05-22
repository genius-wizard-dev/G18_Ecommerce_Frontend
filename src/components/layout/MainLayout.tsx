import { Outlet } from "react-router-dom";
import { AIPopup } from "../ui/ai-popup";
import { CartDrawer } from "../ui/cart-drawer";
import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <AIPopup />
    </div>
  );
}
