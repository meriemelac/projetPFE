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
        <div className="px-4 py-6  mx-auto">

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4 !md:mb-6">
                <div className="flex flex-col">
                    <button
                        onClick={() => window.history.go(-1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded !font-bold !text-5xl w-fit"
                    >
                        ←
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Liste des projets</h2>
                </div>

                {canManage && (
                    <div className="self-end md:self-auto">
                        <button
                            onClick={() => navigate("/projects/create")}
                            className="text-white  px-4 py-2 rounded"
                            style={{ backgroundColor: "#0077B6" }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}
                        >
                            + Ajouter un projet
                        </button>
                    </div>
                )}
            </div>



            {projects.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 !p-0">
                    {projects.map((proj) => (
                        <li key={proj.id} className="bg-white p-4 rounded-lg shadow border border-gray-100 !space-y-2">
                            <p className="p-0 m-0"><strong>Titre :</strong> {proj.title}</p>
                            <p className="p-0 m-0"><strong>Description :</strong> {proj.description}..
                                <button
                                    onClick={() => navigate(`/projects/${proj.id}`)}
                                    style={{ color: "#0077B6" }}
                                    className="!text-blue rounded px-1 hover:underline"
                                >
                             Voir détails
                                </button>
                                </p>
                            <div className="mt-3">

                                {canManage && (
                                    <div className="flex gap-3 justify-end">
                                        <button
                                            onClick={() => navigate(`/projects/edit/${proj.id}`)}
                                            className="text-white text-sm rounded !px-2 py-2"
                                        style={{ backgroundColor: "#1fb06d" }}
                                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#23c47a")}
                                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#1fb06d")}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(proj.id)}
                                            className="text-white text-sm rounded !px-2 py-2"
                                        style={{ backgroundColor: "#dc3545" }}
                                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#ec5c6a")}
                                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc3545")}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
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
