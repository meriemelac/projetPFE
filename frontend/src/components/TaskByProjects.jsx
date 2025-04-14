import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api"; // Import de l'instance Axios
import { useNavigate } from "react-router-dom";


const TasksByProjects = () => {
    const [projects, setprojects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchprojects = async () => {
            try {
                const response = await axiosInstance.get("/projects");
                setprojects(response.data.projects); // on extrait le tableau
                console.log("projects reçues:", response.data.projects);
            } catch (error) {
                setError(error.response?.data?.message || "Erreur lors de la récupération des projects");
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchprojects();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>projects</h2>
            {projects.length > 0 ? (
                <ul>
                    {projects.map((proj) => (
                        <li key={proj.id}>
                            <p><strong>Projet :</strong> {proj.title}</p>
                            <p><strong>Description du projet :</strong> {proj.description}</p>
                            <button onClick={() => navigate(`/projects/${proj.id}/tasks`)}>
                                Voir le tableau Kanban
                            </button>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune depication trouvée</p>
            )}
        </div>
    );
};

export default TasksByProjects;
