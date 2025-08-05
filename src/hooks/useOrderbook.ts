import { useCallback, useEffect, useState } from "react";
import { useWebSocket } from "./useWebSocket";
import type { Order } from "../types/Market";
import axios from "axios";

export const useOrderbook = (symbol: string | undefined) => {
    const { subscribe, isConnected, sendMessage, unsubscribe } = useWebSocket();
    const [asks, setAsks] = useState<Order[]>([]);
    const [bids, setBids] = useState<Order[]>([]);
    const [base, setBase] = useState<string>("");
    const [quote, setQuote] = useState<string>("");
    const [price, setPrice] = useState<{
        lastPrice: number;
        beforeLastPrice: number | null;
    } | null>(null);

    const fetchOrderbook = useCallback(async () => {
        if (!symbol) return;
        try {
            const res = await axios.get(
                `http://localhost:3000/orderbook/${symbol}`
            );
            const data = res.data;
            setAsks(data.asks || []);
            setBids(data.bids || []);
            setQuote(data.quote || "");
            setBase(data.base || "");
            setPrice({
                lastPrice: data.lastPrice || null,
                beforeLastPrice: null,
            });
        } catch (err) {
            console.error("Failed to fetch orderbook:", err);
        }
    }, [symbol]);

    const applyDelta = (list: Order[], delta: { action: string; order: Order }) => {
        if (delta.action === "remove") {
            return list.filter((o) => o.id !== delta.order.id);
        }
        if (delta.action === "add" || delta.action === "update") {
            const idx = list.findIndex((o) => o.id === delta.order.id);
            if (idx >= 0) {
                const updated = [...list];
                updated[idx] = { ...updated[idx], remaining: delta.order.remaining };
                return updated;
            }
            return [...list, delta.order];
        }
        return list;
    };

    const handleDeltaBatch = useCallback((msg: any) => {
        const { deltas } = msg;
        if (!Array.isArray(deltas)) return;

        setBids((prev) =>
            deltas
                .filter((d) => d.order.side === "buy")
                .reduce((acc, d) => applyDelta(acc, d), prev)
                .sort((a: { price: number; }, b: { price: number; }) => b.price - a.price)
        );

        setAsks((prev) =>
            deltas
                .filter((d) => d.order.side === "sell")
                .reduce((acc, d) => applyDelta(acc, d), prev)
                .sort((a: { price: number; }, b: { price: number; }) => a.price - b.price)
        );
    }, []);

    const handleDeltaSingle = useCallback((msg: any) => {
        const { order, action } = msg;
        if (order.side === "buy") {
            setBids((prev) => applyDelta(prev, { action, order }).sort((a, b) => b.price - a.price));
        } else {
            setAsks((prev) => applyDelta(prev, { action, order }).sort((a, b) => a.price - b.price));
        }
    }, []);

    const handleTradeBatch = useCallback((msg: any) => {
        const { trades } = msg;
        if (!Array.isArray(trades) || trades.length === 0) return;
        setPrice((prev) => ({
            lastPrice: trades[trades.length - 1].price || null,
            beforeLastPrice: prev?.lastPrice || null,
        }));
    }, []);

    const handleTradeSingle = useCallback((msg: any) => {
        setPrice((prev) => ({
            lastPrice: msg.price || null,
            beforeLastPrice: prev?.lastPrice || null,
        }));
    }, []);

    useEffect(() => {
        if (!isConnected || !symbol) return;

        fetchOrderbook();

        subscribe("orderbook.delta.batch", handleDeltaBatch);
        subscribe("trade.executed.batch", handleTradeBatch);

        subscribe("orderbook.delta", handleDeltaSingle);
        subscribe("trade.executed", handleTradeSingle);

        sendMessage({
            type: "orderbook.subscribe",
            payload: { symbol },
        });
        sendMessage({
            type: "trade.subscribe",
            payload: { symbol },
        });

        return () => {
            unsubscribe("orderbook.delta.batch", handleDeltaBatch);
            unsubscribe("trade.executed.batch", handleTradeBatch);
            unsubscribe("orderbook.delta", handleDeltaSingle);
            unsubscribe("trade.executed", handleTradeSingle);
        };
    }, [
        isConnected,
        symbol,
        subscribe,
        unsubscribe,
        sendMessage,
        fetchOrderbook,
        handleDeltaBatch,
        handleTradeBatch,
        handleDeltaSingle,
        handleTradeSingle,
    ]);

    return { asks, bids, price, base, quote };
};
