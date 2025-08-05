import {Typography} from "@mui/material";
import {aggregateOrders} from "../../utils/utils";
import type {AggregatedOrder, Order} from "../../types/Market";
import {useEffect, useState} from "react";

interface AmountProps {
    orders: Order[];
    side: "buy" | "sell";
}

export default function Total({orders, side}: AmountProps) {
    const [aggregatedAsks, setAggregatedAsks] = useState<AggregatedOrder[]>([]);

    useEffect(() => {
        if (orders.length === 0) {
            setAggregatedAsks(Array(10).fill({price: 0, size: 0, total: 0}));
            return;
        }

        const aggregated = aggregateOrders(orders).sort(
            (a, b) => b.price - a.price
        ).slice(0, 10);
        let withTotal: AggregatedOrder[] = [];

        if (side === "sell") {
            withTotal = aggregated
                .slice()
                .reverse()
                .reduce((acc: AggregatedOrder[], curr) => {
                    const lastTotal =
                        acc.length > 0 ? acc[acc.length - 1].total : 0;
                    acc.push({
                        ...curr,
                        total: parseFloat((lastTotal + curr.size).toFixed(4)),
                    });
                    return acc;
                }, [])
                .reverse();
        } else {
            withTotal = aggregated
                .slice()
                .reduce((acc: AggregatedOrder[], curr) => {
                    const lastTotal =
                        acc.length > 0 ? acc[acc.length - 1].total : 0;
                    acc.push({
                        ...curr,
                        total: parseFloat((lastTotal + curr.size).toFixed(4)),
                    });
                    return acc;
                }, []);
        }

        if (withTotal.length < 10) {
            const filler = Array(10 - withTotal.length).fill({
                price: 0,
                size: 0,
                total: 0,
            });

            if (side === "sell") {
                withTotal.unshift(...filler);
            } else {
                withTotal.push(...filler);
            }
        }

        setAggregatedAsks(withTotal);
    }, [orders, side]);
    return (
        <div style={{display: "flex", flexDirection: "column", gap: 2}}>
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
                    {ask.total !== 0 ? ask.total : "-"}
                </Typography>
            ))}
        </div>
    );
}
