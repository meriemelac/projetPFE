import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Avatar, AvatarGroup } from "@chakra-ui/react"

function Navbar() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4">
            {/* Logo / Nom de l'application */}
            <h1 className="text-xl font-bold">Mon Application</h1>

            {/* Liens + bouton déconnexion */}
            <div className="flex items-center space-x-6">
                <Avatar.Root>
                    <Avatar.Fallback name="Segun Adebayo" />
                    <Avatar.Image src="" />
                </Avatar.Root>
                <Link to="/notifications" className="text-gray-600 hover:text-blue-600">Mes notifications</Link>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600">Mon profil</Link>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                >
                    Se déconnecter
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
