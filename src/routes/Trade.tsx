import {useParams} from "react-router-dom";
import {useWebSocket} from "../hooks/useWebSocket";
import {useEffect, useState} from "react";

type Order = {
    id: string;
    price: number;
    remaining: number;
};

export default function Trade() {
    const {subscribe, isConnected, sendMessage, unsubscribe} = useWebSocket();
    const {quote} = useParams();

    const [asks, setAsks] = useState<Order[]>([]);
    const [bids, setBids] = useState<Order[]>([]);
    const [lastPrice, setLastPrice] = useState<number | null>(null);

    useEffect(() => {
        if (!isConnected || !quote) return;

        const handleInit = (data: any) => {
            setAsks(data.asks || []);
            setBids(data.bids || []);
        };

        const handleDelta = (msg: any) => {
            const {order, action} = msg;
            const update = (list: Order[], isAdd: boolean) => {
                if (isAdd) {
                    return [...list, order].sort((a, b) =>
                        order.side === "buy"
                            ? b.price - a.price
                            : a.price - b.price
                    );
                } else {
                    return list.filter((o) => o.id !== order.id);
                }
            };

            if (order.side === "buy") {
                setBids((prev) => update(prev, action === "add"));
            } else {
                setAsks((prev) => update(prev, action === "add"));
            }
        };

        const handleTrade = (msg: any) => {
            setLastPrice(msg.price || null);
        };

        subscribe("orderbook.init", handleInit);
        subscribe("orderbook.delta", handleDelta);
        subscribe("trade", handleTrade);

        sendMessage({
            type: "orderbook.subscribe",
            payload: {
                symbol: quote,
            },
        });

        return () =>
            unsubscribe("orderbook.init", () => {
                console.log("Unsubscribed from orderbook updates for", quote);
            });
    }, [isConnected, quote, sendMessage, subscribe, unsubscribe]);

    return (
        <div style={{padding: "1rem", fontFamily: "monospace"}}>
            <h2>Trade {quote}</h2>
            <h3>Last Price: {lastPrice ? lastPrice.toFixed(2) : "-"}</h3>

            <div style={{display: "flex", gap: "2rem"}}>
                <div>
                    <h4 style={{color: "red"}}>Asks</h4>
                    <ul>
                        {asks.slice(0, 10).map((o) => (
                            <li key={o.id}>
                                {o.price.toFixed(2)} x {o.remaining.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 style={{color: "green"}}>Bids</h4>
                    <ul>
                        {bids.slice(0, 10).map((o) => (
                            <li key={o.id}>
                                {o.price.toFixed(2)} x {o.remaining.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
