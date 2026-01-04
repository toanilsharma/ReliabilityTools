
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
    interface Window {
        gtag: (
            command: "config" | "event" | "js",
            targetId: string | Date,
            config?: Record<string, any>
        ) => void;
    }
}

const GoogleAnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        if (window.gtag) {
            window.gtag("config", "G-95EY3EDXMR", {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    return null;
};

export default GoogleAnalyticsTracker;
