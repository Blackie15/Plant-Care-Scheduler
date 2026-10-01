import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import logoImg from "../assets/transparent-logo.png";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "USER",
        location: "",
        gardeningExperience: "Beginner",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        notificationPreferences: "EMAIL_AND_INAPP",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...payload } = formData;
            await registerUser(payload);

            setMessage("Registration successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-logo-section">
                    <div className="register-emblem">
                        <img src={logoImg} alt="PlantCare Scheduler Logo" className="register-logo-img" />
                    </div>
                    <span className="register-tagline">Botanical Care Platform</span>
                    <h1>Create Your Botanical Account</h1>
                    <p>Begin tracking, scheduling, and nurturing your indoor garden with expert precision.</p>
                </div>

                {message && <div className="alert-message alert-success">{message}</div>}
                {error && <div className="alert-message alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Username *</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="e.g. green_thumb"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="e.g. user@plantcare.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Password *</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="At least 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="USER">Plant Parent (User)</option>
                                <option value="SPECIALIST">Botanist / Specialist</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Gardening Experience</label>
                            <select
                                name="gardeningExperience"
                                value={formData.gardeningExperience}
                                onChange={handleChange}
                            >
                                <option value="Beginner">Beginner (First few plants)</option>
                                <option value="Intermediate">Intermediate (Indoor / Patio garden)</option>
                                <option value="Expert">Expert (Urban jungle / Horticulturist)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Location (City / Climate Zone)</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. London, UK, Seattle (Zone 8b)"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Notification Preference</label>
                            <select
                                name="notificationPreferences"
                                value={formData.notificationPreferences}
                                onChange={handleChange}
                            >
                                <option value="EMAIL_AND_INAPP">Email + In-App Alerts</option>
                                <option value="INAPP_ONLY">In-App Only</option>
                                <option value="EMAIL_ONLY">Email Only</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="register-btn" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Botanical Account"}
                    </button>
                </form>

                <p className="login-redirect-text">
                    Already have an account?{" "}
                    <span role="button" tabIndex={0} onClick={() => navigate("/login")}>
                        Sign in here
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Register;