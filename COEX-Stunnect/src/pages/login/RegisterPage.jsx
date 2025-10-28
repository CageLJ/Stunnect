import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./AuthStyles.css";

export const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [study, setStudy] = useState("");
    const [profileImage, setProfileImage] = useState(null); // new
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    // regex rules
    const emailRegex = /^s\d{7}@student\.hsleiden\.nl$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/;

    // validate image file (MIME type, extension, size, and actual image decoding)
    const validateImageFile = (file) => {
        return new Promise((resolve) => {
            if (!file) return resolve(false);

            const ALLOWED_MIME = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            const ALLOWED_EXT = ["jpg", "jpeg", "png", "gif", "webp"];
            const MAX_BYTES = 5 * 1024 * 1024; // 5 MB limit

            // MIME type & size quick checks
            if (!ALLOWED_MIME.includes(file.type)) return resolve(false);
            if (file.size > MAX_BYTES) return resolve(false);

            // extension check
            const nameParts = file.name.split(".");
            const ext = nameParts.length > 1 ? nameParts.pop().toLowerCase() : "";
            if (!ALLOWED_EXT.includes(ext)) return resolve(false);

            // final check: try to decode the image by loading it into an Image object
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(true);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                resolve(false);
            };
            img.src = url;
        });
    };

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

        // If user selected a file, validate it strictly
        if (profileImage) {
            const ok = await validateImageFile(profileImage);
            if (!ok) {
                setError("Invalid image. Upload a JPG/PNG/GIF/WEBP file under 5 MB.");
                setShowPopup(true);
                return;
            }
        }

        setSubmitting(true);
        try {
            // build FormData so we can include profile image
            const formData = new FormData();
            formData.append("username", username.trim());
            formData.append("email", email.trim());
            formData.append("password", password);
            formData.append("follows_study", study.trim() || "");
            if (profileImage) {
                formData.append("profile_image", profileImage);
            }

            await register(formData);
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
            <form className="auth-form" onSubmit={handleSubmit} encType="multipart/form-data">
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

                <div className="file-upload-wrapper">
                    <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                        className="file-input"
                    />
                    <label htmlFor="profileImage" className="file-label">
                        {profileImage ? "Change Profile Picture" : "Upload Profile Picture"}
                    </label>
                    {profileImage && <span className="file-name">{profileImage.name}</span>}
                </div>

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
                        <p>{error || "something went wrong"}</p>
                        <button onClick={() => setShowPopup(false)}>OK</button>
                    </div>
                </div>
            )}
        </main>
    );
};
