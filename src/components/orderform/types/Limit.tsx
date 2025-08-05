import {Box, Button, OutlinedInput, Tooltip, Typography} from "@mui/material";
import OrderSide from "../OrderSide";
import {useOrderForm} from "../../../hooks/useOrderForm";

export default function LimitType() {
    const {price, base, quote, orderSide} = useOrderForm();
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <OrderSide />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{color: "text.secondary"}}
                    >
                        Price
                    </Typography>
                    <OutlinedInput
                        size="small"
                        sx={{
                            borderRadius: 2,
                        }}
                        value={price}
                        endAdornment={
                            <Typography sx={{color: "text.secondary"}}>
                                {quote}
                            </Typography>
                        }
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{color: "text.secondary"}}
                    >
                        Size
                    </Typography>
                    <OutlinedInput
                        size="small"
                        sx={{
                            borderRadius: 2,
                        }}
                        value={""}
                        endAdornment={
                            <Typography sx={{color: "text.secondary"}}>
                                {base}
                            </Typography>
                        }
                    />
                </Box>
                <div>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{color: "text.secondary"}}
                        >
                            Available:
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{color: "text.primary"}}
                        >
                            0.0000 {orderSide === "buy" ? quote : base}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{color: "text.secondary"}}
                        >
                            {orderSide === "buy" ? "Max Buy" : "Max Sell"}:
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{color: "text.primary"}}
                        >
                            0.0000 {orderSide === "buy" ? base : quote}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{color: "text.secondary"}}
                        >
                            Fees:
                        </Typography>
                        <Tooltip
                            title="1% maker fee, 1% taker fee"
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.primary",
                                    borderBottom: "1px dotted currentColor",
                                    cursor: "help",
                                    display: "inline-block",
                                    lineHeight: 1.2,
                                }}
                            >
                                1% / 1%
                            </Typography>
                        </Tooltip>
                    </Box>
                </div>
            </Box>
            <Button
                variant="contained"
                color={orderSide === "buy" ? "success" : "error"}
                sx={{
                    borderRadius: 2,
                    marginTop: 2,
                    textTransform: "none",
                }}
                disabled={!price}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: orderSide === "buy" ? "black" : "white",
                    }}
                >
                    {orderSide === "buy"
                        ? `Buy / Long ${base}`
                        : `Sell / Short ${base}`}
                </Typography>
            </Button>
        </div>
    );
}
