import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-08-29T19:00:00");

function getTimeLeft(target) {
    const difference = target.getTime() - Date.now();

    if (difference <= 0) {
        return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
    };
}

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(EVENT_DATE));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(EVENT_DATE));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="countdown-grid" aria-label="Countdown to the event">
            <div className="countdown-card">
                <p className="countdown-number">{timeLeft.days}</p>
                <p className="countdown-label">Dies</p>
            </div>
            <div className="countdown-card">
                <p className="countdown-number">{timeLeft.hours}</p>
                <p className="countdown-label">Hores</p>
            </div>
            <div className="countdown-card">
                <p className="countdown-number">{timeLeft.minutes}</p>
                <p className="countdown-label">Minuts</p>
            </div>
            <div className="countdown-card">
                <p className="countdown-number">{timeLeft.seconds}</p>
                <p className="countdown-label">Segons</p>
            </div>
        </div>
    );
}
