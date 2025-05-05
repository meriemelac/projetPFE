import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Supposons que le role_id est stocké dans le localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const roleId = user?.role_id;
    const canManage = ["1", "2", "3"].includes(roleId);

    useEffect(() => {
        fetchProjects();
    }, []);

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

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
            try {
                await axiosInstance.delete(`/projects/${id}`);
                setProjects(projects.filter((proj) => proj.id !== id));
            } catch (error) {
                alert(error.response?.data?.message || "Erreur lors de la suppression");
            }
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="p-4">
            {canManage && (
                <button
                    onClick={() => navigate("/projects/create")}
                    className="mb-4 bg-green-600  px-4 py-2 rounded"
                >
                    + Ajouter un projet
                </button>
            )}

            <h2 className="text-xl font-bold mb-2">Liste des projets</h2>

            {projects.length > 0 ? (
                <ul className="space-y-4">
                    {projects.map((proj) => (
                        <li key={proj.id} className="border rounded p-4 shadow">
                            <p><strong>Titre :</strong> {proj.title}</p>
                            <p><strong>Description :</strong> {proj.description}</p>
                            <div className="space-x-2 mt-2">
                                <button
                                    onClick={() => navigate(`/projects/${proj.id}`)}
                                    className="bg-blue-500 px-3 py-1 rounded "
                                >
                                    Voir détails
                                </button>

                                {canManage && (
                                    <>
                                        <button
                                            onClick={() => navigate(`/projects/edit/${proj.id}`)}
                                            className="bg-yellow-500 px-3 py-1 rounded "
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(proj.id)}
                                            className="bg-red-600 px-3 py-1 rounded"
                                        >
                                            Supprimer
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun projet trouvé.</p>
            )}
        </div>
    );
};

export default Projects;
