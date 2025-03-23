import { Outlet, Link } from "react-router-dom";
import "./test.css"; // Pour le CSS
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

const Layout = () => {
    return (
        <div className="app-container">
            {/* Navbar en haut */}
            <header className="navbar">
                <Navbar />
            </header>

            <div className="content-container">
                {/* Sidebar à gauche */}
                <Sidebar />

                {/* Contenu principal */}
                <main className="main-content">
                    <Outlet /> {/* C'est ici que les pages s'affichent */}
                </main>
            </div>
        </div>
    );
};

export default Layout;
