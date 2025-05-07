import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Avatar, For, HStack } from "@chakra-ui/react";
import { FaProjectDiagram, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axiosInstance from "../api/api"; // remplace par ton chemin d'axiosInstance

function Sidebar() {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(true);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Supposons que le role_id est stocké dans le localStorage
    const roleId = user?.role_id;
    const canManage = ["1", "2", "3"].includes(roleId);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axiosInstance.get("/projects");
                setProjects(response.data.projects);
            } catch (error) {
                setError(error.response?.data?.message || "Erreur lors de la récupération des projets");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <nav className={`sidebar ${isOpen ? "open" : "closed"}`}>
            <div className="toggle-btn" onClick={toggleSidebar}>
                {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
            </div>

            <ul>
                {loading && <li>Chargement...</li>}
                {error && <li style={{ color: "red" }}>{error}</li>}

                {projects.map(proj => (
                    <li key={proj.id}>
                        <Link to={`/projects/${proj.id}/tasks`}>
                            <Avatar.Root shape="rounded" size="md" colorPalette="red">
                                <Avatar.Fallback name="Segun Adebayo" />
                                {/* <Avatar.Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04" /> */}
                            </Avatar.Root>
                            {isOpen && <span className="project-title">{proj.title}</span>}
                        </Link>
                    </li>
                ))}
                {canManage && (
                <li>
                    <Link to={`/projects/create`}>
                        <Avatar.Root shape="rounded" size="md" colorPalette="red">
                            {/* Insérer le SVG directement ici */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg>
                        </Avatar.Root>
                        {isOpen && <span className="project-title">Ajouter un projet</span>}
                    </Link>
                </li>
                )}

            </ul>
        </nav>
    );
}

export default Sidebar;
