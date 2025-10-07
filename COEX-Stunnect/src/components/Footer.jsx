import { Link, NavLink } from "react-router-dom"

import "./Footer.css"

export const Footer = () => {
    return (
        <footer>
            <nav className="navigation">
                <NavLink to="/" className="link">Posts</NavLink>
                <NavLink to="/posts/create" className="link">Create Post</NavLink>
                <NavLink to="/chat" className="link">Chat</NavLink>
                <NavLink to="/account" className="link">Account</NavLink>
            </nav>
        </footer>
    )
}
