import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./Home";
import Trade from "./Trade";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "trade",
        element: <Trade />
    },
    {
        path: "trade/:symbol",
        element: <Trade />
    }
]);

function Router() {
    return <RouterProvider router={router} />;
}

export default Router;
