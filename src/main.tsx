import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {ThemeProvider} from "@emotion/react";
import theme from "./theme.ts";
import {CssBaseline} from "@mui/material";
import Router from "./routes/Router.tsx";
import {WebSocketProvider} from "./contexts/WebSocketProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <WebSocketProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router />
            </ThemeProvider>
        </WebSocketProvider>
    </StrictMode>
);
