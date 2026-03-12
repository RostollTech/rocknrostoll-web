import { Outlet, ScrollRestoration } from "react-router-dom";
import ScrollToAnchor from "./ScrollToAnchor";
import AnnouncementBanner from "./AnnouncementBanner";

export default function Layout() {
    return (
        <>
            <ScrollRestoration />
            <ScrollToAnchor />
            <Outlet />
            {/* <AnnouncementBanner /> */}
        </>
    );
}
