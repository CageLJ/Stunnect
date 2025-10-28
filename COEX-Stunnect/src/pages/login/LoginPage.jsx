import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./AuthStyles.css";

export const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!username.trim() || !password) {
            setError("username and password are required.");
            setShowPopup(true);
            return;
        }

        setSubmitting(true);
        try {
            await login({ username, password });
            navigate("/posts");
        } catch (err) {
            setError("Invalid credentials. Please try again.");
            setShowPopup(true);
            setPassword(""); // Clear only password field
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="auth-container">
            <h1 className="auth-title">Login</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                />

                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                />

                <button type="submit" disabled={submitting}>
                    {submitting ? "Logging in..." : "Log in"}
                </button>

                <div className="login-link">
                    <span>Don’t have an account?</span>
                    <Link to="/register" className="login-btn-link">
                        Register
                    </Link>
                </div>
            </form>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <p>{error}</p>
                        <button onClick={() => setShowPopup(false)}>OK</button>
                    </div>
                </div>
            )}
        </main>
    );
};
