import React from "react";

interface Product {
    name: string;
    price: string;
    image: string;
}

interface ShopData {
    name: string;
    status: string;
    productCount: number;
    followers: number;
    rating: string;
}

const shopData: ShopData = {
    name: "ThươngĐồCâu",
    status: "Online",
    productCount: 83,
    followers: 836,
    rating: "4.5/5 (5k Đánh Giá)",
};

const products: Product[] = [
    {
        name: "Dây 2 Lớp 1.0mm",
        price: "50.000 VNĐ",
        image: "https://photo.znews.vn/w1920/Uploaded/yqdxwpjwq/2021_04_06/sohu.jpg",
    },
    {
        name: "Đạn Bi Thép 8mm",
        price: "100.000 VNĐ",
        image: "https://photo.znews.vn/w1920/Uploaded/yqdxwpjwq/2021_04_06/sohu.jpg",
    },
    {
        name: "Slingshot Chuyên Nghiệp",
        price: "250.000 VNĐ",
        image: "https://photo.znews.vn/w1920/Uploaded/yqdxwpjwq/2021_04_06/sohu.jpg",
    },
    {
        name: "Dây Full 25cm Size 0.55",
        price: "80.000 VNĐ",
        image: "https://photo.znews.vn/w1920/Uploaded/yqdxwpjwq/2021_04_06/sohu.jpg",
    },
];

const BrandShop = () => {
    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <header className="bg-red-500 text-white p-6 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">{shopData.name}</h1>
                            <span className="text-green-300 text-sm font-medium">● {shopData.status}</span>
                        </div>
                        <div className="mt-2 flex gap-2 flex-wrap">
                            <span className="bg-white text-red-500 font-semibold px-2 py-0.5 rounded text-xs">Yêu Thích</span>
                            <button className="border border-white px-3 py-1 rounded text-sm hover:bg-white hover:text-red-500 transition">
                                + Theo Dõi
                            </button>
                            <button className="border border-white px-3 py-1 rounded text-sm hover:bg-white hover:text-red-500 transition">
                                💬 Chat
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 text-sm text-white">
                        <div>
                            🏬 <span className="text-white/80">Sản Phẩm:</span>{" "}
                            <span className="font-semibold">{shopData.productCount}</span>
                        </div>
                        <div>
                            🧑‍🤝‍🧑 <span className="text-white/80">Người Theo Dõi:</span>{" "}
                            <span className="font-semibold">{shopData.followers}</span>
                        </div>
                        <div>
                            ⭐ <span className="text-white/80">Đánh Giá:</span>{" "}
                            <span className="font-semibold">{shopData.rating}</span>
                        </div>
                    </div>
                </div>
            </header>



            <main className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-gray-900 font-medium text-sm truncate mb-2">{product.name}</h3>
                                <p className="text-red-500 font-bold text-sm">{product.price}</p>
                                <button className="mt-3 w-full border border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 text-sm py-1 rounded">
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default BrandShop;
