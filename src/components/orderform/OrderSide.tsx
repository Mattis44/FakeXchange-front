import {Box, Typography} from "@mui/material";
import {useOrderForm} from "../../hooks/useOrderForm";

export default function OrderSide() {
    const {orderSide, setOrderSide} = useOrderForm();

    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                backgroundColor: (theme) => theme.palette.divider,
                borderRadius: 2,
                boxShadow: 1,
                gap: 1,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: orderSide === "buy" ? 0 : "50%",
                    width: "50%",
                    backgroundColor:
                        orderSide === "buy" ? "success.main" : "error.main",
                    borderRadius: 2,
                    transition: "left 150ms cubic-bezier(0.65, 0, 0.35, 1)",
                    zIndex: 0,
                }}
            />

            <Box
                onClick={() => setOrderSide("buy")}
                sx={{
                    paddingY: 1,
                    flexGrow: 1,
                    cursor: "pointer",
                    textAlign: "center",
                    zIndex: 1,
                }}
            >
                <Typography
                    sx={{
                        color: orderSide === "buy" ? "black" : "white",
                        fontSize: "0.9rem",
                    }}
                >
                    Buy / Long
                </Typography>
            </Box>

            <Box
                onClick={() => setOrderSide("sell")}
                sx={{
                    paddingY: 1,
                    flexGrow: 1,
                    cursor: "pointer",
                    textAlign: "center",
                    zIndex: 1,
                }}
            >
                <Typography
                    sx={{
                        color: "white",
                        fontSize: "0.9rem",
                    }}
                >
                    Sell / Short
                </Typography>
            </Box>
        </Box>
    );
}
