import { Discount } from "@/schema/discount";

const VoucherCard = ({
    discount,
    userId,
    handleApplyDiscount,
    handleSelectEditedDiscount,
    handleDeleteDiscount
}: {
    discount: Discount;
    userId: string | null;
    handleApplyDiscount: ((discountId: string) => void) | null;
    handleSelectEditedDiscount: ((discountId: string) => void) | null;
    handleDeleteDiscount: ((discountId: string) => void) | null;
}) => {
    const occurences = discount.used_user_list.reduce((occurences, id) => {
        if (userId === id) return ++occurences;
        return occurences;
    }, 0);

    const isAvailableDiscount = occurences < discount.quantity_per_user;

    return (
        <div className="bg-white rounded-xl shadow-md flex items-stretch border border-gray-300 border-l-10 border-l-blue-600 w-[500px] mb-4">
            <div className={`border-r border-r-gray-300 ${userId ? "p-3" : "p-3 px-10"} flex flex-col justify-center`}>
                <p className="font-semibold">Giảm</p>
                <p className="text-lg font-semibold text-red-500">{`${discount.discount_value} ${
                    discount.discount_type === "fixed" ? "VND" : "%"
                }`}</p>
            </div>

            <div className="flex flex-col gap-0.5 p-3 px-4 flex-1">
                <h3 className="text-lg font-semibold">{`${discount.name}`}</h3>
                {userId ? (
                    <p>{`Số lần dùng: ${occurences}/${discount.quantity_per_user}`}</p>
                ) : (
                    <div>
                        <p>{`Số lượng: ${discount.quantity}`}</p>
                        <p>{`Số lần dùng: ${discount.quantity_per_user}`}</p>
                    </div>
                )}

                <p className="text-sm text-gray-400">{`Ngày hết hạn: ${new Date(
                    discount.expiry_time
                ).toLocaleDateString("en-GB")}`}</p>
            </div>

            <div className="flex justify-center items-center p-3 px-5 flex-col gap-2">
                {handleApplyDiscount && (
                    <button
                        className={`h-10 w-26 rounded-sm flex justify-center items-center text-white font-semibold  ${
                            !isAvailableDiscount
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-600 cursor-pointer active:scale-95"
                        }`}
                        onClick={() => (isAvailableDiscount ? handleApplyDiscount(discount._id) : null)}
                    >
                        Dùng
                    </button>
                )}

                {handleSelectEditedDiscount && (
                    <button
                        className={`h-10 w-26 rounded-sm flex justify-center items-center text-white font-semibold  ${
                            !isAvailableDiscount
                                ? "bg-orange-300 cursor-not-allowed"
                                : "bg-orange-500 cursor-pointer active:scale-95"
                        }`}
                        onClick={() => handleSelectEditedDiscount(discount._id)}
                    >
                        Cập nhật
                    </button>
                )}

                {handleDeleteDiscount && (
                    <button
                        className={`h-10 w-26 rounded-sm flex justify-center items-center text-white font-semibold  ${
                            !isAvailableDiscount
                                ? "bg-red-300 cursor-not-allowed"
                                : "bg-red-500 cursor-pointer active:scale-95"
                        }`}
                        onClick={() => handleDeleteDiscount(discount._id)}
                    >
                        Xóa
                    </button>
                )}
            </div>
        </div>
    );
};

export default VoucherCard;
