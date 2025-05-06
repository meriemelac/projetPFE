import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";

const TasksByProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user")); // 👈 récupère l'utilisateur connecté
    const roleId = parseInt(user?.role_id, 10); // 👈 récupère le rôle

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axiosInstance.get("/projects");
                setProjects(response.data.projects);
                console.log("Projects reçus:", response.data.projects);
            } catch (error) {
                setError(error.response?.data?.message || "Erreur lors de la récupération des projects");
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Projets</h2>
            {projects.length > 0 ? (
                <ul>
                    {projects.map((proj) => (
                        <li key={proj.id}>
                            <p><strong>Projet :</strong> {proj.title}</p>
                            <p><strong>Description :</strong> {proj.description}</p>

                            {/* 👇 Bouton normal : tableau des tâches de l'utilisateur connecté */}
                            <button onClick={() => navigate(`/projects/${proj.id}/tasks`)}>
                                Voir mon tableau Kanban
                            </button>

                            {/* 👇 Bouton réservé aux rôles responsables */}
                            {roleId === 1 || roleId === 2 || roleId === 3 ? (
                                <button
                                    onClick={() => navigate(`/projects/${proj.id}/tasks/all`)}
                                    style={{ marginLeft: "10px" }}
                                >
                                    Voir toutes les tâches du projet
                                </button>
                            ) : null}

                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun projet trouvé</p>
            )}
        </div>
    );
};

export default TasksByProjects;
