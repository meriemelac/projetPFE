import React from 'react'
import { Link } from "react-router-dom";


function Navbar() {
    return (
        <div>
            <h1>Mon Application</h1>
            <ul>
                <li><Link to="/profile">My profile</Link></li>
            </ul>
        </div>
    )
}

export default Navbar