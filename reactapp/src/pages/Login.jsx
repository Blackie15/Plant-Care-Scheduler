import { useState } from "react";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/transparent-logo.png";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const token = await loginUser(email, password);
            login(token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo-section">
                    <div className="login-emblem">
                        <img src={logoImg} alt="PlantCare Scheduler Logo" className="login-logo-img" />
                    </div>

                    <h1>Plant Care Scheduler</h1>
                    <p>Elevate your indoor botanicals with clinical precision.</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Authenticating..." : "Sign In to Garden"}
                    </button>
                </form>

                <p className="register-text">
                    Don't have an account?{" "}
                    <span role="button" tabIndex={0} onClick={() => navigate("/register")}>
                        Create an Account
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;