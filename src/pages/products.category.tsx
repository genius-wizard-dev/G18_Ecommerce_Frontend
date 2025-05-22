import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProducts } from "@/redux/thunks/product";
import { ProductCategory } from "@/schema/product";
import { getImageUrl } from "@/utils/getImage";
import { Filter, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  thumbnailImage: string;
  discount?: number;
}

const ProductCard = ({
  _id,
  name,
  price,
  thumbnailImage,
  discount,
}: ProductCardProps) => {
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

const getCategoryName = (categoryId: string) => {
  const category = Object.entries(ProductCategory).find(
    ([_, value]) => value === categoryId
  );
  return category ? category[0] : "Danh mục";
};

const ProductCategoryPage = () => {
  const { categoryId } = useParams();
  const dispatch = useAppDispatch();
  const { products, isLoading } = useAppSelector((state) => state.product);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // Lọc sản phẩm theo danh mục từ store hiện tại
  useEffect(() => {
    if (categoryId) {
      const filtered = products.filter(
        (product: any) => product.category === categoryId
      );
      setFilteredProducts(filtered);
    }
  }, [categoryId, products]);

  // Fetch dữ liệu mới khi chuyển danh mục
  useEffect(() => {
    if (categoryId) {
      setIsFetching(true);
      dispatch(
        getProducts({ category: categoryId, limit: 50, page: 1 })
      ).finally(() => {
        setIsFetching(false);
      });
    }
  }, [categoryId, dispatch]);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  const showLoading = isLoading && filteredProducts.length === 0;
  const showEmptyState = !isLoading && filteredProducts.length === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {categoryId && getCategoryName(categoryId)}
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-500 mt-1">
            {filteredProducts.length} sản phẩm được tìm thấy
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">Sắp xếp theo:</span>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="price-asc">Giá tăng dần</SelectItem>
            <SelectItem value="price-desc">Giá giảm dần</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <span className="ml-2 text-gray-600">Đang tải sản phẩm...</span>
        </div>
      ) : showEmptyState ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Không tìm thấy sản phẩm nào trong danh mục này
          </p>
          <Button className="mt-4" asChild>
            <Link to="/">Quay lại trang chủ</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product: any) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategoryPage;
