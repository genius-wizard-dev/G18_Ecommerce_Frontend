import { Discount } from "@/schema/discount";

const VoucherCard = ({
    discount,
    userId,
    handleApplyDiscount
}: {
    discount: Discount;
    userId: string;
    handleApplyDiscount: (discountId: string) => void;
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md flex items-stretch border border-gray-300 border-l-10 border-l-blue-600 w-[500px] mb-4">
            <div className="border-r border-r-gray-300 p-3 flex flex-col justify-center">
                <p className="font-semibold">Giảm</p>
                <p className="text-lg font-semibold text-red-500">{`${discount.discount_value} ${
                    discount.discount_type === "fixed" ? "VND" : "%"
                }`}</p>
            </div>

            <div className="flex flex-col gap-0.5 p-3 px-4 flex-1">
                <h3 className="text-lg font-semibold">{`${discount.name}`}</h3>
                <p>{`Số lần dùng: ${discount.used_user_list.reduce((occurences, id) => {
                    if (userId === id) return ++occurences;
                    return occurences;
                }, 0)}/${discount.quantity_per_user}`}</p>

                <p className="text-sm text-gray-400">{`Ngày hết hạn: ${new Date(
                    discount.expiry_time
                ).toLocaleDateString("en-GB")}`}</p>
            </div>

            <div className="flex justify-center items-center p-3 px-5">
                <button
                    className="h-10 w-26 rounded-sm flex justify-center items-center bg-blue-600 text-white font-semibold cursor-pointer active:scale-95"
                    onClick={() => handleApplyDiscount(discount._id)}
                >
                    Dùng
                </button>
            </div>
        </div>
    );
};

export default VoucherCard;
