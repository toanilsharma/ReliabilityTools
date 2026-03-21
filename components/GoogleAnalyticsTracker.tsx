
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

/**
 * Track a custom event in Google Analytics.
 * Usage: trackEvent('tool_used', { tool_name: 'mtbf-calculator' })
 */
export const trackEvent = (
    eventName: string,
    params?: Record<string, string | number | boolean>
) => {
    if (window.gtag) {
        window.gtag("event", eventName, params);
    }
};

const GoogleAnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        if (window.gtag) {
            window.gtag("config", "G-95EY3EDXMR", {
                page_path: location.pathname + location.search,
                page_title: document.title,
            });
        }
    }, [location]);

    return null;
};

export default GoogleAnalyticsTracker;
