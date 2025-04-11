import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/api";

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axiosInstance.get(`/projects/${id}`);
                setProject(response.data.project);
            } catch (error) {
                setError("Erreur lors de la récupération du projet.");
            }
        };

        const fetchMembers = async () => {
            try {
                const response = await axiosInstance.get(`/projects/${id}/members`);
                setMembers(response.data.members);
            } catch (error) {
                console.error("Erreur chargement des membres du projet");
            }
        };

        fetchProject();
        fetchMembers();
    }, [id]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!project) return <p>Chargement...</p>;

    return (
        <div>
            <h2>Projet : {project.title}</h2>
            <p><strong>Description :</strong> {project.description}</p>
            <p><strong>Statut :</strong> {project.status}</p>

            <h3 style={{ marginTop: "30px" }}>Membres du projet :</h3>
            <ul>
                {members.length > 0 ? (
                    members.map((member) => (
                        <li key={member.id}>
                            {member.first_name} {member.last_name} – <em>{member.pivot.role || "Membre"}</em>
                        </li>
                    ))
                ) : (
                    <li>Aucun membre affecté.</li>
                )}
            </ul>

            <button onClick={() => navigate("/projects")} style={{ marginTop: "20px" }}>
                Retour
            </button>
        </div>
    );
};

export default ProjectDetails;
