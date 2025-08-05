import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Box, Tab} from "@mui/material";
import MarketType from "./types/Market";
import LimitType from "./types/Limit";
import {useOrderForm} from "../../hooks/useOrderForm";

export default function OrderType() {
    const {orderType, setOrderType} = useOrderForm();
    return (
        <Box sx={{width: "100%"}}>
            <TabContext value={orderType}>
                <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                    <TabList onChange={(_, newValue) => setOrderType(newValue)}>
                        <Tab label="Market" value="market" sx={{flexGrow: 1}} />
                        <Tab label="Limit" value="limit" sx={{flexGrow: 1}} />
                    </TabList>
                </Box>
                <TabPanel value="market">
                    <MarketType />
                </TabPanel>
                <TabPanel value="limit">
                    <LimitType />
                </TabPanel>
            </TabContext>
        </Box>
    );
}
