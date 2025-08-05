import {useParams} from "react-router-dom";
import {useOrderbook} from "../hooks/useOrderbook";
import Orderbook from "../components/orderbook/View";
import {Box} from "@mui/material";
import Asset from "../components/Asset";
import Chart from "../components/Chart";
import OrderForm from "../components/orderform/View";
import {OrderFormProvider} from "../contexts/OrderFormProvider";
import AccountSummary from "../components/AccountSummary";
import Assets from "../components/Assets";
import { useCandles } from "../hooks/useCandles";

export default function Trade() {
    const {symbol} = useParams();
    const {asks, bids, price, base, quote} = useOrderbook(symbol);
    const {candles} = useCandles(symbol || "TESTUSD", "1m");
    

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                padding: 2,
                gap: 1,
            }}
        >
            <Box sx={{display: "flex", gap: 1}}>
                <Box
                    sx={{
                        width: "60%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    <Asset quote={quote} base={base} price={price} />
                    <Chart symbol={symbol || "TESTUSD"} candles={candles}/>
                </Box>
                <Box
                    sx={{
                        width: "20%",
                    }}
                >
                    <Orderbook
                        asks={asks}
                        bids={bids}
                        price={price}
                        base={base}
                        quote={quote}
                    />
                </Box>
                <Box
                    sx={{
                        width: "20%",
                    }}
                >
                    <OrderFormProvider
                        base={base}
                        quote={quote}
                        price={price?.lastPrice}
                    >
                        <OrderForm />
                    </OrderFormProvider>
                </Box>
            </Box>
            <Box sx={{display: "flex", gap: 1}}>
                <Box sx={{width: "80%"}}>
                    <AccountSummary />
                </Box>
                <Box sx={{width: "20%"}}>
                    <Assets />
                </Box>
            </Box>
        </Box>
    );
}
