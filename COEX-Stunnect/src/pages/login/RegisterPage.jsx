import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./AuthStyles.css";

export const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [study, setStudy] = useState("");
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    // regex rules
    const emailRegex = /^s\d{7}@student\.hsleiden\.nl$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!username.trim() || !email.trim() || !password) {
            setError("All required fields must be filled.");
            setShowPopup(true);
            return;
        }

        if (!emailRegex.test(email)) {
            setError("Email must be a valid student email");
            setShowPopup(true);
            return;
        }

        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters and include one letter and one number.");
            setShowPopup(true);
            return;
        }

        setSubmitting(true);
        try {
            await register({
                username: username.trim(),
                email: email.trim(),
                password,
                study: study.trim() || undefined,
            });
            navigate("/posts");
        } catch (err) {
            setError(err.message || "Registration failed");
            setShowPopup(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="auth-container">
            <h1 className="auth-title">Create account</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                />

                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student email"
                    type="email"
                />

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    type="password"
                />

                <input
                    value={study}
                    onChange={(e) => setStudy(e.target.value)}
                    placeholder="study (optional)"
                />

                <button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create account"}
                </button>

                <div className="login-link">
                    <span>Already have an account?</span>
                    <Link to="/login" className="login-btn-link">
                        Log in
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
