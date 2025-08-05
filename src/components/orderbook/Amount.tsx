import {Typography} from "@mui/material";
import {aggregateOrders} from "../../utils/utils";
import type {AggregatedOrder, Order} from "../../types/Market";
import {useEffect, useState} from "react";

interface AmountProps {
    orders: Order[];
    side: "buy" | "sell";
}

export default function Amount({orders, side}: AmountProps) {
    const [aggregatedAsks, setAggregatedAsks] = useState<AggregatedOrder[]>([]);

    useEffect(() => {
        if (orders.length === 0) {
            setAggregatedAsks(Array(10).fill({price: 0, size: 0, total: 0}));
            return;
        }
        const aggregated = aggregateOrders(orders).sort(
            (a, b) => b.price - a.price
        ).slice(0, 10);
        if (aggregated.length < 10) {
            if (side === "sell") {
                aggregated.unshift(
                    ...Array(10 - aggregated.length).fill({price: 0, size: 0})
                );
            } else {
                aggregated.push(
                    ...Array(10 - aggregated.length).fill({price: 0, size: 0})
                );
            }
        }
        setAggregatedAsks(aggregated);
    }, [orders, side]);
    return (
        <div style={{display: "flex", flexDirection: "column", gap: 2 }}>
            {aggregatedAsks?.map((ask, index) => (
                <Typography
                    key={`${ask.price}-${ask.size}-${index}`}
                    sx={{
                        color: (theme) =>
                            side === "sell"
                                ? theme.palette.error.main
                                : theme.palette.success.main,
                        fontSize: 15,
                    }}
                >
                    {ask.size !== 0 ? ask.size : "-"}
                </Typography>
            ))}
        </div>
    );
}
