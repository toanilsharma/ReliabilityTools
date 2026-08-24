
import { useEffect } from "react";
import { useLocation } from "react-router-dom";



import { trackEvent } from "../utils/analytics";
export { trackEvent };

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
