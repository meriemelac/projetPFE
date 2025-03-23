import React from 'react'
import { Link } from "react-router-dom";


function Sidebar() {
    return (
            <nav className="sidebar">
                <ul>
                    <li><Link to="/">Accueil</Link></li>
                    <li><Link to="/test">test</Link></li>
                </ul>
            </nav>
    )
}

export default Sidebar