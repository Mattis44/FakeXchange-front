import {useCallback, useEffect, useState} from "react";
import {useWebSocket} from "./useWebSocket";
import type {Candle} from "../types/Market";
import axios from "axios";

export const useCandles = (symbol: string, resolution: string) => {
    const {subscribe, isConnected, sendMessage, unsubscribe} = useWebSocket();
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
            return [...filtered, newCandle].sort(
                (a, b) => a.timestamp - b.timestamp
            );
        });
    }, []);

    const handleUpdateCandle = useCallback((msg: any) => {
        setCandles((prev) => {
            return prev.map((candle) => {
                if (candle.timestamp === msg.timestamp) {
                    return {
                        ...candle,
                        open: msg.open,
                        high: msg.high,
                        low: msg.low,
                        close: msg.close,
                        volume: msg.volume,
                    };
                }
                return candle;
            });
        });
    }, []);

    useEffect(() => {
        if (!isConnected || !symbol) return;
        fetchCandles();

        subscribe("candle.add", handleNewCandle);
        subscribe("candle.update", handleUpdateCandle);

        sendMessage({
            type: "candle.subscribe",
            payload: {symbol, resolution},
        });

        return () => {
            unsubscribe("candle.add", handleNewCandle);
            unsubscribe("candle.update", handleUpdateCandle);
        };
    }, [
        fetchCandles,
        handleNewCandle,
        handleUpdateCandle,
        isConnected,
        resolution,
        sendMessage,
        subscribe,
        symbol,
        unsubscribe,
    ]);

    return {candles, loading};
};
