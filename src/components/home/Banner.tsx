import api from "@/lib/axios/api.service";
import { ENDPOINTS } from "@/lib/axios/endpoint";
import { Button } from "../ui/button";

const Banner = () => {
  const handleClick = async () => {
    try {
      await api.get<any>(
        ENDPOINTS.PRODUCT.GET_BY_ID("680a6a26b3c8ae3592f095cc")
      );
    } catch (error) {}
  };
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-5">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-8 md:p-12 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                G18 Ecommerce
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                Mua sắm thả ga - Giao hàng tận nhà
              </h2>
              <p className="mb-6 text-white/90">
                Khám phá hàng ngàn sản phẩm chất lượng với giá ưu đãi đặc biệt.
                Giao hàng nhanh chóng và chính sách đổi trả linh hoạt tại G18
                Ecommerce.
              </p>
              <Button
                onClick={handleClick}
                className="bg-white text-red-500 hover:bg-gray-100 hover:text-red-600"
              >
                Xem thêm
              </Button>
            </div>
            <div className="hidden md:block md:w-1/2">
              <img
                src="https://images.pexels.com/photos/7679863/pexels-photo-7679863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="ProCare+ Banner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
