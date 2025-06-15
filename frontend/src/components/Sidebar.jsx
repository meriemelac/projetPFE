import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Avatar, For, HStack } from "@chakra-ui/react";
import { FaProjectDiagram, FaChevronLeft, FaChevronRight, FaBuilding, FaUsers, FaPlus, FaTasks } from "react-icons/fa";
import { GoProjectRoadmap } from "react-icons/go";

import axiosInstance from "../api/api";

function Sidebar() {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(true);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    
    const firstname = user?.first_name;
    const lastname = user?.last_name;
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

    const isActive = (path) => {
        return location.pathname === path;
    };

    const managementItems = [
        { path: "/departments", icon: FaBuilding, label: "Départements" },
        { path: "/teams", icon: FaUsers, label: "Équipes" },
        { path: "/projects", icon: GoProjectRoadmap, label: "Projets" }
    ];

    return (
        <>
            <nav className={`sidebar ${isOpen ? "open" : "closed"}`}>
                {/* Overlay pour mobile */}
                <div className="toggle-btn" onClick={toggleSidebar}>
                    {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
                </div>



                {/* User Profile */}
                {user && (
                    <div className="sidebar__profile">
                        <div className="sidebar__profile-avatar">
                            <Avatar.Root shape="rounded" size="md" colorPalette="blue">
                                <Avatar.Fallback name={user.name || "User"} />
                                {user.avatar && <Avatar.Image src={user.avatar} />}
                            </Avatar.Root>
                        </div>
                        {isOpen && (
                            <div className="sidebar__profile-info">
                                <div className="sidebar__profile-name">Bonjour, {firstname || "Utilisateur"}</div>
                                <div className="sidebar__profile-name">{lastname || "Utilisateur"}</div>
                            </div>
                        )}
                    </div>
                )}

                <div className="sidebar__content">
                    {/* Section Management */}
                    {canManage && (
                        <div className="sidebar__section">
                            {isOpen && <div className="sidebar__section-title">Gestion</div>}
                            <ul className="sidebar__menu">
                                {managementItems.map((item) => (
                                    <li key={item.path} className="sidebar__menu-item">
                                        <Link
                                            to={item.path}
                                            className={`sidebar__menu-link ${isActive(item.path) ? "sidebar__menu-link--active" : ""}`}
                                        >
                                            <div className="sidebar__menu-icon">
                                                <item.icon />
                                            </div>
                                            {isOpen && (
                                                <span className="sidebar__menu-text">{item.label}</span>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Section Projects */}
                    <div className="sidebar__section">
                        {isOpen && <div className="sidebar__section-title">Projets</div>}
                        <ul className="sidebar__menu">
                            {loading && (
                                <li className="sidebar__menu-item">
                                    <div className="sidebar__loading">
                                        <div className="sidebar__spinner"></div>
                                        {isOpen && <span>Chargement...</span>}
                                    </div>
                                </li>
                            )}

                            {error && (
                                <li className="sidebar__menu-item">
                                    <div className="sidebar__error">
                                        {isOpen && <span>{error}</span>}
                                    </div>
                                </li>
                            )}

                            {projects.map(proj => (
                                <li key={proj.id} className="sidebar__menu-item">
                                    <Link
                                        to={`/projects/${proj.id}/tasks`}
                                        className={`sidebar__menu-link ${isActive(`/projects/${proj.id}/tasks`) ? "sidebar__menu-link--active" : ""}`}
                                    >
                                        <div className="sidebar__menu-icon">
                                            <Avatar.Root shape="rounded" size="sm" colorPalette="teal">
                                                <Avatar.Fallback name={proj.title} />
                                            </Avatar.Root>
                                        </div>
                                        {isOpen && (
                                            <div className="sidebar__project-info">
                                                <span className="sidebar__menu-text">{proj.title}</span>
                                                {proj.description && (
                                                    <span className="sidebar__project-desc">{proj.description}</span>
                                                )}
                                            </div>
                                        )}
                                    </Link>
                                </li>
                            ))}

                            {canManage && (
                                <li className="sidebar__menu-item">
                                    <Link
                                        to="/projects/create"
                                        className={`sidebar__menu-link sidebar__menu-link--create ${isActive("/projects/create") ? "sidebar__menu-link--active" : ""}`}
                                    >
                                        <div className="sidebar__menu-icon">
                                            <FaPlus />
                                        </div>
                                        {isOpen && (
                                            <span className="sidebar__menu-text">Nouveau projet</span>
                                        )}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <style jsx>{`
                
                





                .sidebar__profile {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding-bottom: 15px;
                    padding-top: 15px;
                }

                .sidebar__profile-info {
                    flex: 1;
                    min-width: 0;
                }

                .sidebar__profile-name {
                    font-weight: 600;
                    font-size: 0.9rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .sidebar__profile-role {
                    font-size: 0.75rem;
                    opacity: 0.8;
                    color: #e2e8f0;
                }

                .sidebar__content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem 0;
                }

                .sidebar__content::-webkit-scrollbar {
                    width: 4px;
                }

                .sidebar__content::-webkit-scrollbar-track {
                    background: transparent;
                }

                .sidebar__content::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 2px;
                }

                .sidebar__section {
                    margin-bottom: 2rem;
                }

                .sidebar__section-title {
                    padding: 0 1rem 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    opacity: 0.7;
                    color: #e2e8f0;
                }

                .sidebar__menu {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .sidebar__menu-item {
                    margin: 0.25rem 0;
                }

                .sidebar__menu-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: rgba(255, 255, 255, 0.9);
                    text-decoration: none;
                    transition: all 0.2s ease;
                    position: relative;
                    overflow: hidden;
                    padding : 3px;
                }

                .sidebar__menu-link::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                }

                .sidebar__menu-link:hover::before {
                    transform: translateX(0);
                }

                .sidebar__menu-link:hover {
                    color: white;
                    transform: translateX(5px);
                }

                .sidebar__menu-link--active {
                    background: rgba(255, 255, 255, 0.15);
                    color: white;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }

               

                .sidebar__menu-link--create {
                        padding : 5px;
                    border: 1px dashed rgba(255, 255, 255, 0.3);
                    margin: 0.5rem 0 0.5rem 0;
                }

                .sidebar__menu-link--create:hover {
                    border-color: rgba(255, 255, 255, 0.6);
                    background: rgba(255, 255, 255, 0.05);
                }

                .sidebar.closed .sidebar__menu-icon {
    margin: 0 auto; /* centre horizontalement */
    justify-content: center;
}


                .sidebar__menu-icon {
                    display: flex;
                    align-items: center;
                    
                    
                    font-size: 1.5rem;
                    position: relative;
                    z-index: 1;
                }

                .sidebar__menu-text {
                    font-weight: 500;
                    font-size: 0.9rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    position: relative;
                    z-index: 1;
                }

                .sidebar__project-info {
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    position: relative;
                    z-index: 1;
                }

                .sidebar__project-desc {
                    font-size: 0.75rem;
                    opacity: 0.7;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-top: 0.125rem;
                }

                .sidebar__loading {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    color: rgba(255, 255, 255, 0.7);
                }

                .sidebar__spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .sidebar__error {
                    padding: 0.75rem 1rem;
                    color: #ff6b6b;
                    font-size: 0.875rem;
                }



                /* Animation d'entrée */
                .sidebar {
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }

                /* États hover améliorés */
                

                .sidebar__menu-link--active .sidebar__menu-icon {
                    color: #ffd700;
                }

                /* Amélioration du focus pour l'accessibilité */
                .sidebar__menu-link:focus {
                
         
                }
            `}</style>
        </>
    );
}

export default Sidebar;