import { NavLink } from "react-router-dom"
import { FaRegUserCircle, FaRegPlusSquare, FaHome } from "react-icons/fa";

import "./Footer.css"

export const Footer = () => {
    return (
        <footer>
            <nav className="navigation">
                <NavLink to="/posts" end className="link"><FaHome /></NavLink>
                <NavLink to="/posts/create" className="link"><FaRegPlusSquare /></NavLink>
                {/* <NavLink to="/chat" className="link">Chat</NavLink> */}
                <NavLink to="/account" className="link"><FaRegUserCircle /></NavLink>
            </nav>
        </footer>
    )
}
