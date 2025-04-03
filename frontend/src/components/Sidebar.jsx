import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Sidebar() {
    const { user } = useContext(AuthContext);

    return (
        <nav className="sidebar">
            <div>
                {user ? <h1>Hello, {user.first_name} {user.last_name}!</h1> : <h1>Hello</h1>}
            </div>
            <ul>
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/test">Test</Link></li>
            </ul>
        </nav>
    );
}

export default Sidebar;
