import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProducts } from "@/redux/thunks/product";
import { getShopInfo } from "@/redux/thunks/profile";
import { Profile } from "@/schema/profile";
import { Filter, Loader2, Package, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BrandShop = () => {
    const { shopId } = useParams();
    const dispatch = useAppDispatch();
    const { products, isLoading } = useAppSelector((state) => state.product);
    const [shopInfo, setShopInfo] = useState<Profile>();
    const [sortBy, setSortBy] = useState<string>("newest");
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

    // Lọc sản phẩm theo danh mục từ store hiện tại
    useEffect(() => {
        if (shopId) {
            const filtered = products.filter(
                (product: any) => product.shopId === shopId
            );
            setFilteredProducts(filtered);
        }
    }, [shopId, products]);

    // Fetch dữ liệu mới khi chuyển danh mục
    useEffect(() => {
        if (shopId) {
            setIsFetching(true);
            Promise.all([
                dispatch(getShopInfo({ shopId })).then((data) => {
                    if (typeof data.payload !== "string") {
                        setShopInfo(data.payload?.result);
                    }
                }),
                dispatch(getProducts({ shop: shopId, limit: 50, page: 1 })),
            ]).finally(() => {
                setIsFetching(false);
            });
        }
    }, [shopId, dispatch]);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "price-asc":
                return a.price - b.price;
            case "price-desc":
                return b.price - a.price;
            case "newest":
            default:
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
        }
    });

    const showEmptyState = !isLoading && products.length === 0;
    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg shadow mb-6 mt-2">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold">
                            {shopInfo?.shopName}
                        </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-white">
                        <div className="flex items-center space-x-2">
                            <Package className="h-6 w-6 text-white" />
                            <span className="text-white/90">Sản Phẩm:</span>
                            <span className="font-semibold text-white">
                                {products.length}
                            </span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                            <span className="text-white/90">Đánh Giá:</span>
                            <span className="font-semibold text-white">
                                {(
                                    products.reduce(
                                        (acc: number, cur: any) =>
                                            acc + cur.ratings.average,
                                        0
                                    ) / products.length
                                ).toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex items-center justify-between mb-6 px-6">
                <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">Sắp xếp theo:</span>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="newest">Mới nhất</SelectItem>
                        <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                        <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isFetching ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                    <span className="ml-2 text-gray-600">
                        Đang tải sản phẩm...
                    </span>
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
                <main className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {sortedProducts.map((product, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="overflow-hidden">
                                    <img
                                        src={product.thumbnailImage}
                                        alt={product.name}
                                        className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-gray-900 font-medium text-sm truncate mb-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-red-500 font-bold text-sm">
                                        {product.price.toLocaleString()}₫
                                    </p>
                                    <button className="mt-3 w-full border border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 text-sm py-1 rounded">
                                        <Link to={`/product/${product._id}`}>
                                            Xem chi tiết
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            )}
        </div>
    );
};

export default BrandShop;
