import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import $ from 'jquery';

function Navbar() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    useEffect(() => {
        // Le code jQuery doit être dans useEffect pour éviter d’être réexécuté à chaque render
        $(".toggle").on("click", function () {
            $(".item").toggleClass("active");
        });

        // Nettoyage à la désactivation du composant
        return () => {
            $(".toggle").off("click");
        };
    }, []);

    return (
        <nav>
            <ul className='menu m-0'>
                <li className='logo text-white'><Link to="/">Taskwave</Link></li>
                <li className='item text-white'><Link to="/notifications">Mes notifications</Link></li>
                <li className='item text-white'><Link to="/profile">Mon profil</Link></li>
                <li className='item text-white'>
                    <Link to="/login" onClick={handleLogout}>
                        Se déconnecter
                    </Link>
                </li>
                <li className='item button text-white'><a href="#">Messages</a></li>
                <li className='item button secondary text-white'><a href="#">incase2</a></li>
                <li className='toggle text-white'><span className='bars'></span></li>
            </ul>
        </nav>
    );
}

export default Navbar;
