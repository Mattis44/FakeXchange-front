import {createTheme} from "@mui/material";
import {red} from "@mui/material/colors";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#7c43bd",
            light: "#a16ae8",
            dark: "#4a1769",
            contrastText: "rgb(0, 0, 0, 0.87)",
        },
        secondary: {
            main: "#f50057",
            light: "#ff4081",
            dark: "#c51162",
            contrastText: "rgb(255, 255, 255, 0.87)",
        },
        error: {
            main: red.A400,
            light: red.A200,
            dark: red.A700,
            contrastText: "rgb(0, 0, 0, 0.87)",
        },
        background: {
            default: "#121212",
            paper: "#1d1d1d",
        },
        text: {
            primary: "rgb(255, 255, 255, 0.87)",
            secondary: "rgb(255, 255, 255, 0.6)",
            disabled: "rgb(255, 255, 255, 0.38)",
        },
        success: {
            main: "#26a69a",
            
        }
    },
});

export default theme;
