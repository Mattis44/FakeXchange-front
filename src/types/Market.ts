export type Order = {
    id: string;
    price: number;
    remaining: number;
    side: "buy" | "sell";
};

export type AggregatedOrder = {
    price: number;
    size: number;
    total: number;
};

export type Candle = {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}