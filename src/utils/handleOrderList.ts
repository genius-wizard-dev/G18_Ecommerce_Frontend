import { CheckOrderInput } from "@/schema/order";

export function getOrderList(): CheckOrderInput[] {
    const data = localStorage.getItem("orderList");
    return data ? JSON.parse(data) : [];
}

export function removeOrderById(orderNumberList: string[]) {
    const data = localStorage.getItem("orderList");
    if (!data) return;

    const orderList: CheckOrderInput[] = JSON.parse(data);
    const newOrderList: CheckOrderInput[] = orderList.filter(
        (order: CheckOrderInput) => !orderNumberList.includes(order.orderNumber)
    );

    if (newOrderList.length === 0) localStorage.removeItem("orderList");
    else localStorage.setItem("orderList", JSON.stringify(newOrderList));
}
