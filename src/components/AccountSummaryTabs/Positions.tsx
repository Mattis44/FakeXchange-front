import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

export default function Positions() {
    return (
        <Box>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Token</TableCell>
                            <TableCell>Side</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Entry</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>PnL</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>TEST</TableCell>
                            <TableCell sx={{color: "success.main"}}>Long</TableCell>
                            <TableCell>$40,000</TableCell>
                            <TableCell>0.1</TableCell>
                            <TableCell>$4,000</TableCell>
                            <TableCell>$40,000</TableCell>
                            <TableCell sx={{color: "success.main"}}>$100</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
