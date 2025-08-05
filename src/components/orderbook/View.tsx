import {Box, Divider, Typography} from "@mui/material";
import type {Order} from "../../types/Market";
import Price from "./Price";
import Amount from "./Amount";
import Total from "./Total";
import {use, useEffect, useState} from "react";

interface OrderbookProps {
    asks: Order[];
    bids: Order[];
    price: {lastPrice: number; beforeLastPrice: number | null} | null;
    base: string;
    quote: string;
}

export default function Orderbook({
    asks,
    bids,
    price,
    base,
    quote,
}: OrderbookProps) {
    const [flash, setFlash] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!price || price.beforeLastPrice == null) return;

        if (price.lastPrice > price.beforeLastPrice) {
            setFlash("up");
        } else if (price.lastPrice < price.beforeLastPrice) {
            setFlash("down");
        }

        const timeout = setTimeout(() => setFlash(undefined), 1500);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [price?.lastPrice]);
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                backgroundColor: (theme) => theme.palette.background.paper,
                padding: 2,
                borderRadius: 3,
                boxShadow: 1,
            }}
        >
            <Typography>Order Book</Typography>
            <Divider sx={{mx: -2}} />
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Typography
                    sx={{
                        color: (theme) => theme.palette.text.disabled,
                        fontSize: 12,
                    }}
                >
                    Price ({quote})
                </Typography>
                <Typography
                    sx={{
                        color: (theme) => theme.palette.text.disabled,
                        fontSize: 12,
                    }}
                >
                    Amount ({base})
                </Typography>
                <Typography
                    sx={{
                        color: (theme) => theme.palette.text.disabled,
                        fontSize: 12,
                    }}
                >
                    Total
                </Typography>
            </div>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Price orders={asks} side="sell" />
                <Amount orders={asks} side="sell" />
                <Total orders={asks} side="sell" />
            </Box>
            <Typography
                sx={{
                    fontSize: 24,
                    color: (theme) =>
                        flash === "up"
                            ? theme.palette.success.main
                            : flash === "down"
                            ? theme.palette.error.main
                            : theme.palette.text.primary,
                    transition: "color 0.3s",
                }}
            >
                {price?.lastPrice ?? "0.0"}
            </Typography>
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                <Price orders={bids} side="buy" />
                <Amount orders={bids} side="buy" />
                <Total orders={bids} side="buy" />
            </Box>
        </Box>
    );
}
