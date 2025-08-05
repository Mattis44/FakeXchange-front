import {Box, Button, Divider, Typography} from "@mui/material";

export default function Assets() {
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
                height: "100%",
            }}
        >
            <Typography>Assets</Typography>
            <Divider sx={{mx: -2}} />
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Button variant="outlined" size="small">
                    Deposit
                </Button>
                <Button variant="outlined" size="small">
                    Withdraw
                </Button>
            </div>
        </Box>
    );
}
