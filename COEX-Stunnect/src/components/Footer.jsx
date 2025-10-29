import { NavLink } from "react-router-dom"
import { FaRegUserCircle } from "react-icons/fa";

import "./Footer.css"

export const Footer = () => {
    return (
        <footer>
            <nav className="navigation">
                <NavLink to="/" className="link">Posts</NavLink>
                <NavLink to="/posts/create" className="link">Create Post</NavLink>
                {/* <NavLink to="/chat" className="link">Chat</NavLink> */}
                <NavLink to="/account" className="link"><FaRegUserCircle /></NavLink>
            </nav>
        </footer>
    )
}
