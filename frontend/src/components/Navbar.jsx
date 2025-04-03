import React from 'react'
import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


function Navbar() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login"); // Rediriger vers la page de connexion
    };

    return (
        <div>
            <h1>Mon Application</h1>
            <ul>
                <li><Link to="/profile">My profile</Link></li>
            </ul>
            <button onClick={handleLogout}>Se déconnecter</button>
        </div>
    )
}

export default Navbar