import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Box, Tab} from "@mui/material";
import {useState} from "react";
import Positions from "./AccountSummaryTabs/Positions";
import OpenOrders from "./AccountSummaryTabs/OpenOrders";
import TradeHistory from "./AccountSummaryTabs/TradeHistory";
import OrderHistory from "./AccountSummaryTabs/OrderHistory";

export default function AccountSummary() {
    const [tabValue, setTabValue] = useState("positions");
    // Get all infos for summary so we don't reload them in each tab (TODO)
    return (
        <Box
            sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
                borderRadius: 3,
                boxShadow: 1,
                width: "100%",
            }}
        >
            <TabContext value={tabValue}>
                <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                    <TabList>
                        <Tab
                            label="Positions"
                            value="positions"
                            onClick={() => setTabValue("positions")}
                        />
                        <Tab
                            label="Open Orders"
                            value="openOrders"
                            onClick={() => setTabValue("openOrders")}
                        />
                        <Tab
                            label="Trade History"
                            value="tradeHistory"
                            onClick={() => setTabValue("tradeHistory")}
                        />
                        <Tab
                            label="Order History"
                            value="orderHistory"
                            onClick={() => setTabValue("orderHistory")}
                        />
                    </TabList>
                </Box>
                <TabPanel value="positions">
                    <Positions />
                </TabPanel>
                <TabPanel value="openOrders">
                    <OpenOrders />
                </TabPanel>
                <TabPanel value="tradeHistory">
                    <TradeHistory />
                </TabPanel>
                <TabPanel value="orderHistory">
                    <OrderHistory />
                </TabPanel>
            </TabContext>
        </Box>
    );
}
