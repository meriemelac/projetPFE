import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBell, FaUser, FaSignOutAlt, FaInbox } from 'react-icons/fa';

function Navbar() {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className="text-white text-xl font-bold">Taskwave</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link 
                            to="/notifications" 
                            className="text-white hover:text-blue-200 p-2 rounded-full hover:bg-blue-700 transition"
                        >
                            <FaBell className="h-5 w-5" />
                        </Link>

                        <Link 
                            to="/messages" 
                            className="text-white hover:text-blue-200 p-2 rounded-full hover:bg-blue-700 transition"
                        >
                            <FaInbox className="h-5 w-5" />
                        </Link>

                        <div className="relative group">
                            <button className="flex items-center text-white hover:text-blue-200 focus:outline-none">
                                <span className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center">
                                    <FaUser className="h-4 w-4" />
                                </span>
                                <span className="ml-2">{user?.first_name}</span>
                            </button>

                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                                <Link 
                                    to="/profile" 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Mon Profil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    <FaSignOutAlt className="inline mr-2" />
                                    Se déconnecter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;