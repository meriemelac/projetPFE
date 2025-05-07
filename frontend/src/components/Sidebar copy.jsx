import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaHome, FaBuilding, FaProjectDiagram, FaUsers, FaTasks, FaUserTie, FaFlask, FaBars } from "react-icons/fa"; // icons

function Sidebar() {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(true); // état d'ouverture/fermeture

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={`sidebar ${isOpen ? "open" : "closed"}`}>

            <div className="toggle-btn" onClick={toggleSidebar}>
                <FaBars />
            </div>

            <ul>
                <li>
                    <Link to="/">
                        <FaHome />
                        {isOpen && <span>Dashboard</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/departments">
                        <FaBuilding />
                        {isOpen && <span>Departments</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/projects">
                        <FaProjectDiagram />
                        {isOpen && <span>Projets</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/teams">
                        <FaUsers />
                        {isOpen && <span>Teams</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/tasks">
                        <FaTasks />
                        {isOpen && <span>Tasks</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/employees">
                        <FaUserTie />
                        {isOpen && <span>Employés</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/test">
                        <FaFlask />
                        {isOpen && <span>Test</span>}
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar;
