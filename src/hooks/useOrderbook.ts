import {useCallback, useEffect, useState} from "react";
import {useWebSocket} from "./useWebSocket";
import type {Order} from "../types/Market";
import axios from "axios";

export const useOrderbook = (symbol: string | undefined) => {
    const {subscribe, isConnected, sendMessage, unsubscribe} = useWebSocket();
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
            const res = await axios.get(`http://localhost:3000/orderbook/${symbol}`);
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

    const handleDelta = useCallback((msg: any) => {
        const {order, action} = msg;
        const update = (list: Order[], isAdd: boolean) => {
            if (isAdd) {
                const withoutExisting = list.filter((o) => o.id !== order.id);
                const updated = [...withoutExisting, order];
                return order.side === "buy"
                    ? updated.sort((a, b) => b.price - a.price)
                    : updated.sort((a, b) => a.price - b.price);
            } else {
                return list.filter((o) => o.id !== order.id);
            }
        };

        if (order.side === "buy") {
            setBids((prev) => update(prev, action === "add"));
        } else {
            setAsks((prev) => update(prev, action === "add"));
        }
    }, []);

    const handleTrade = useCallback((msg: any) => {
        setPrice((prev) => ({
            lastPrice: msg.price || null,
            beforeLastPrice: prev?.lastPrice || null,
        }));
    }, []);

    useEffect(() => {
        if (!isConnected || !symbol) return;

        fetchOrderbook();

        subscribe("orderbook.delta", handleDelta);
        subscribe("trade.executed", handleTrade);

        sendMessage({
            type: "orderbook.subscribe",
            payload: {symbol},
        });
        sendMessage({
            type: "trade.subscribe",
            payload: {symbol},
        });

        return () => {
            unsubscribe("orderbook.delta", handleDelta);
            unsubscribe("trade.executed", handleTrade);
        };
    }, [
        isConnected,
        symbol,
        subscribe,
        unsubscribe,
        sendMessage,
        handleDelta,
        handleTrade,
        fetchOrderbook,
    ]);

    return {asks, bids, price, base, quote};
};
