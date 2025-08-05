import {Box} from "@mui/material";
import OrderType from "./OrderType";

export default function OrderForm() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundColor: (theme) => theme.palette.background.paper,
                borderRadius: 3,
                boxShadow: 1,
                height: "100%",
            }}
        >
            <OrderType />
        </Box>
    );
}
