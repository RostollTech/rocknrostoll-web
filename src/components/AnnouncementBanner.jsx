import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/AnnouncementBanner.css";

export default function AnnouncementBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show banner after a short delay for attention
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="announcement-banner">
            <div className="announcement-content">
                <span className="announcement-icon">🔒</span>
                <span className="announcement-text">
                    La venda de marxandatge ha <strong>finalitzat</strong>. Moltes gràcies!
                </span>
                <Link to="/shop" className="announcement-btn">
                    Informació
                </Link>
                <button
                    className="announcement-close"
                    onClick={() => setIsVisible(false)}
                    aria-label="Tancar avís"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
