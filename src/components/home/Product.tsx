import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProducts } from "@/redux/thunks/product";
import { getImageUrl } from "@/utils/getImage";
import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  thumbnailImage: string;
  discount?: number;
}

const ProductCard: FC<ProductCardProps> = ({
  _id,
  name,
  price,
  thumbnailImage,
  discount,
}) => {
  return (
    <Card className="overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl(thumbnailImage)}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            -{discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 truncate">{name}</h3>
        <div className="flex items-center gap-2">
          {discount ? (
            <>
              <span className="font-semibold text-red-500">
                {(price * (1 - discount / 100)).toLocaleString()}₫
              </span>
              <span className="text-gray-500 text-sm line-through">
                {price.toLocaleString()}₫
              </span>
            </>
          ) : (
            <span className="font-semibold">{price.toLocaleString()}₫</span>
          )}
        </div>
        <Button
          variant="outline"
          className="w-full mt-3 text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
          asChild
        >
          <Link to={`/product/${_id}`}>Xem chi tiết</Link>
        </Button>
      </div>
    </Card>
  );
};

export const Product = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts({ limit: 30, page: 1 }));
  }, []);

  return (
    <section className="bg-white py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Gợi ý cho bạn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.length > 0 &&
            products.map((product: any) => (
              <ProductCard key={product._id} {...product} />
            ))}
        </div>
      </div>
    </section>
  );
};
