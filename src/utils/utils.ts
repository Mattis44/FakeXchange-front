import type {AggregatedOrder, Order} from "../types/Market";

export function aggregateOrders(orders: Order[]): AggregatedOrder[] {
    const map = new Map<number, number>();

    for (const order of orders) {
        const key = order.price.toFixed(2);
        const existing = map.get(+key) || 0;
        map.set(+key, existing + order.remaining);
    }

    return Array.from(map.entries())
        .map(([price, size]) => ({ price, size, total: size }))
}
