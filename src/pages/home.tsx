import Banner from "@/components/home/Banner";
import { Category } from "@/components/home/Category";
import { Product } from "@/components/home/Product";
import { FC } from "react";
import { Link } from "react-router-dom";

const HomePage: FC = () => {
    const searchTerms = [
        "iPhone 15 pro max",
        "Samsung galaxy S24 Ultra",
        "MacBook M3",
        "iPad Pro",
        "AirPods Pro 2",
        "Xiaomi 14 Ultra",
        "Realme GT 5 pro",
        "Microsoft Surface pro 9",
        "Dell XPS 13",
        "Asus ROG Phone 8 Pro",
        "Wireless charger",
        "JBL speaker",
        "Apple Watch series 9",
        "Sony WF-1000XM5",
        "Bàn phím cơ",
        "Tai nghe gaming"
    ];

    return (
        <>
            <Banner />
            <Category />
            <Product />
            <section className="bg-white py-6">
                <div className="container mx-auto px-4">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Tìm kiếm nhiều nhất</h2>
                    <div className="flex flex-wrap gap-2">
                        {searchTerms.map((term, index) => (
                            <Link
                                key={index}
                                to={`/search?q=${encodeURIComponent(term)}`}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                            >
                                {term}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
