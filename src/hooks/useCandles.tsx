import { useCallback, useEffect, useState } from "react";
import { useWebSocket } from "./useWebSocket";
import type { Candle } from "../types/Market";
import axios from "axios";

export const useCandles = (symbol: string, resolution: string) => {
    const { subscribe, isConnected, sendMessage, unsubscribe } = useWebSocket();
    const [candles, setCandles] = useState<Candle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchCandles = useCallback(async () => {
        setLoading(true);
        try {
            const now = Date.now();
            let intervalMs = 60_000;

            switch (resolution) {
                case "1m":
                    intervalMs = 60_000;
                    break;
            }

            const candleCount = 100;
            const endTime = now;
            const startTime = endTime - intervalMs * candleCount;

            const res = await axios.post<Candle[]>(
                `http://localhost:3000/candles`,
                {
                    symbol,
                    resolution,
                    startTime,
                    endTime,
                }
            );
            setCandles(res.data);
        } catch (error) {
            console.error("Failed to fetch candles:", error);
        } finally {
            setLoading(false);
        }
    }, [symbol, resolution]);

    const handleNewCandle = useCallback((msg: any) => {
        const newCandle: Candle = {
            timestamp: msg.data.timestamp,
            open: msg.data.open,
            high: msg.data.high,
            low: msg.data.low,
            close: msg.data.close,
            volume: msg.data.volume,
        };

        setCandles((prev) => {
            const filtered = prev.filter(
                (c) => c.timestamp !== newCandle.timestamp
            );
            return [...filtered, newCandle].sort((a, b) => a.timestamp - b.timestamp);
        });
    }, []);

    const handleUpdateCandle = useCallback((msg: any) => {
        if (!msg.data) return;

        const updatedCandle: Candle = {
            timestamp: msg.data.timestamp,
            open: msg.data.open,
            high: msg.data.high,
            low: msg.data.low,
            close: msg.data.close,
            volume: msg.data.volume,
        };

        setCandles((prev) =>
            prev.map((candle) =>
                candle.timestamp === updatedCandle.timestamp
                    ? { ...candle, ...updatedCandle }
                    : candle
            )
        );
    }, []);

    const handleUpdateCandleBatch = useCallback((msg: any) => {
        if (!Array.isArray(msg.candles)) return;

        setCandles((prev) => {
            const updatedList = [...prev];
            for (const data of msg.candles) {
                const updatedCandle: Candle = {
                    timestamp: data.timestamp,
                    open: data.open,
                    high: data.high,
                    low: data.low,
                    close: data.close,
                    volume: data.volume,
                };
                const index = updatedList.findIndex(
                    (c) => c.timestamp === updatedCandle.timestamp
                );
                if (index >= 0) {
                    updatedList[index] = { ...updatedList[index], ...updatedCandle };
                }
            }
            return updatedList;
        });
    }, []);

    useEffect(() => {
        if (!isConnected || !symbol) return;
        fetchCandles();

        subscribe("candle.add", handleNewCandle);
        subscribe("candle.update", handleUpdateCandle);

        subscribe("candle.update.batch", handleUpdateCandleBatch);

        sendMessage({
            type: "candle.subscribe",
            payload: { symbol, resolution },
        });

        return () => {
            unsubscribe("candle.add", handleNewCandle);
            unsubscribe("candle.update", handleUpdateCandle);
            unsubscribe("candle.update.batch", handleUpdateCandleBatch);
        };
    }, [
        fetchCandles,
        handleNewCandle,
        handleUpdateCandle,
        handleUpdateCandleBatch,
        isConnected,
        resolution,
        sendMessage,
        subscribe,
        symbol,
        unsubscribe,
    ]);

    return { candles, loading };
};
