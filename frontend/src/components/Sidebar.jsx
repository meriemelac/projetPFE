import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaChevronLeft, FaChevronRight, FaTasks, FaProjectDiagram, FaUsers, FaBuilding } from "react-icons/fa";
import axiosInstance from "../api/api";

function Sidebar() {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(true);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axiosInstance.get("/projects");
                setProjects(response.data.projects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className={`sidebar transition-all duration-300 ${isOpen ? "w-64" : "w-20"} bg-gradient-to-b from-blue-800 to-blue-900`}>
            <div 
                className="toggle-btn absolute -right-3 top-4 bg-blue-700 rounded-full p-1 cursor-pointer shadow-lg hover:bg-blue-600 transition"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaChevronLeft className="text-white" /> : <FaChevronRight className="text-white" />}
            </div>

            <div className="mt-6 px-4">
                <div className="space-y-4">
                    {/* Main Navigation */}
                    <div className="space-y-2">
                        <Link 
                            to="/departments"
                            className={`flex items-center p-2 rounded-lg transition ${
                                isActive("/departments") ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-700"
                            }`}
                        >
                            <FaBuilding className="w-5 h-5" />
                            {isOpen && <span className="ml-3">Départements</span>}
                        </Link>

                        <Link 
                            to="/teams"
                            className={`flex items-center p-2 rounded-lg transition ${
                                isActive("/teams") ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-700"
                            }`}
                        >
                            <FaUsers className="w-5 h-5" />
                            {isOpen && <span className="ml-3">Équipes</span>}
                        </Link>

                        <Link 
                            to="/tasks"
                            className={`flex items-center p-2 rounded-lg transition ${
                                isActive("/tasks") ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-700"
                            }`}
                        >
                            <FaTasks className="w-5 h-5" />
                            {isOpen && <span className="ml-3">Tâches</span>}
                        </Link>
                    </div>

                    {/* Projects Section */}
                    {isOpen && <h3 className="text-blue-300 font-semibold px-2 mt-8 mb-4">Mes Projets</h3>}
                    
                    <div className="space-y-2">
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-300 mx-auto"></div>
                            </div>
                        ) : (
                            projects.map(project => (
                                <Link
                                    key={project.id}
                                    to={`/projects/${project.id}/tasks`}
                                    className={`flex items-center p-2 rounded-lg transition ${
                                        isActive(`/projects/${project.id}/tasks`) 
                                            ? "bg-blue-700 text-white" 
                                            : "text-blue-100 hover:bg-blue-700"
                                    }`}
                                >
                                    <FaProjectDiagram className="w-5 h-5" />
                                    {isOpen && (
                                        <span className="ml-3 truncate" title={project.title}>
                                            {project.title}
                                        </span>
                                    )}
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Add Project Button */}
                    {isOpen && user?.role_id <= 3 && (
                        <Link
                            to="/projects/create"
                            className="flex items-center p-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
                        >
                            <span className="text-xl mr-2">+</span>
                            Nouveau Projet
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Sidebar;