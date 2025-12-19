import { Outlet, ScrollRestoration } from "react-router-dom";
import ScrollToAnchor from "./ScrollToAnchor";

export default function Layout() {
    return (
        <>
            <ScrollRestoration />
            <ScrollToAnchor />
            <Outlet />
        </>
    );
}
