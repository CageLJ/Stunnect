import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export const NotFoundPage = () => {
    return (
        <main className="not-found-container">
        <div className="not-found-card">
            <h1 className="not-found-title">404</h1>
            <p className="not-found-subtitle">Oops! Page not found</p>
            <p className="not-found-text">
            The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="home-btn">
            Go back home
            </Link>
        </div>
        </main>
    );
};
