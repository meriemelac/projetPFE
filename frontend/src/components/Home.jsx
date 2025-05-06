import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
            <h1>Bienvenue sur la page d'accueil</h1>
            <div>
                {user ? <h1>Hello, {user.first_name} {user.last_name}!</h1> : <h1>Hello</h1>}
            </div>
            <ul>
                <li><Link className="text-black" to="/">Dashboard</Link></li>
                <li><Link className="text-black" to="/departments">Departments</Link></li>
                <li><Link className="text-black" to="/projects">Projets</Link></li>
                <li><Link className="text-black" to="/teams">Teams</Link></li>
                <li><Link className="text-black" to="/tasks">Tasks</Link></li>
                <li><Link className="text-black" to="/employees">Employés</Link></li>
                <li><Link className="text-black" to="/test">Test</Link></li>

            </ul>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-open-fill" viewBox="0 0 16 16">
                <path d="M8.941.435a2 2 0 0 0-1.882 0l-6 3.2A2 2 0 0 0 0 5.4v.314l6.709 3.932L8 8.928l1.291.718L16 5.714V5.4a2 2 0 0 0-1.059-1.765zM16 6.873l-5.693 3.337L16 13.372v-6.5Zm-.059 7.611L8 10.072.059 14.484A2 2 0 0 0 2 16h12a2 2 0 0 0 1.941-1.516M0 13.373l5.693-3.163L0 6.873z" />
            </svg>
        </>
    )
};

export default Home;
