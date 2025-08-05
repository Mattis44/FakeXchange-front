import {Box, Chip, Tooltip, Typography} from "@mui/material";
import {useWebSocket} from "../hooks/useWebSocket";

interface AssetProps {
    quote: string;
    base: string;
    price: {lastPrice: number; beforeLastPrice: number | null} | null;
}

export default function Asset({quote, base, price}: AssetProps) {
    const {isConnected} = useWebSocket();
    return (
        <Box
            sx={{
                padding: 2,
                backgroundColor: (theme) => theme.palette.background.paper,
                borderRadius: 3,
                boxShadow: 1,
                display: "flex",
                gap: 2,
            }}
        >
            <Tooltip
                title={isConnected ? "Connected" : "Disconnected"}
                placement="bottom"
            >
                <Box
                    sx={{
                        backgroundColor: (theme) =>
                            isConnected
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        alignSelf: "center",
                    }}
                />
            </Tooltip>
            <div style={{display: "flex", flexDirection: "row", gap: 6}}>
                <Typography
                    sx={{
                        fontSize: 24,
                    }}
                >
                    {base}{quote}
                </Typography>
                {/* <Chip
                    label="Perp"
                    size="small"
                    color="default"
                    sx={{alignSelf: "center", color: "white", borderRadius: 1}}
                /> */}
            </div>
            <Typography
                sx={{
                    fontSize: 24,
                    color: (theme) =>
                        price?.beforeLastPrice == null
                            ? undefined
                            : price.lastPrice > price.beforeLastPrice
                            ? theme.palette.success.main
                            : price.lastPrice < price.beforeLastPrice
                            ? theme.palette.error.main
                            : undefined,
                }}
            >
                {price?.lastPrice ?? "0.0"}
            </Typography>
        </Box>
    );
}
