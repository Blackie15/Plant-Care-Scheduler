import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/transparent-logo.png";
import "./Landing.css";

function Landing() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Smooth progress animation over 2.8 seconds
        const intervalTime = 30; // ms
        const totalDuration = 3000; // ms
        const step = (intervalTime / totalDuration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + step;
                if (next >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return next;
            });
        }, intervalTime);

        // Auto navigate once timer finishes
        const redirectTimeout = setTimeout(() => {
            if (user?.id) {
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/login", { replace: true });
            }
        }, totalDuration + 200);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimeout);
        };
    }, [navigate, user]);

    const handleEnterNow = () => {
        if (user?.id) {
            navigate("/dashboard", { replace: true });
        } else {
            navigate("/login", { replace: true });
        }
    };

    return (
        <div className="landing-screen" onClick={handleEnterNow}>
            <div className="landing-overlay"></div>

            <div className="landing-center-content">
                <div className="landing-logo-container">
                    <img
                        src={logoImg}
                        alt="PlantCare Scheduler Logo"
                        className="landing-logo"
                    />
                </div>

                <div className="landing-typography">

                    <h1 className="landing-title">PlantCare Scheduler</h1>
                    <p className="landing-tagline">Nurture your botanical sanctuary with expert care</p>
                </div>

                <div className="landing-progress-wrap">
                    <div className="landing-progress-bar">
                        <div
                            className="landing-progress-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="landing-progress-label">
                        Entering Sanctuary...
                    </span>
                </div>

                <button
                    className="landing-enter-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEnterNow();
                    }}
                >
                    Enter Now →
                </button>
            </div>
        </div>
    );
}

export default Landing;
