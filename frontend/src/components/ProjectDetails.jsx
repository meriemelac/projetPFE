import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/api";
import { AuthContext } from "../context/AuthContext";

const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [error, setError] = useState(null);
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    };

    const roleId = user?.role_id;
    const canManage = ["1", "2", "3"].includes(roleId);
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
        <div className="px-4 py-6 mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4 !md:mb-6">
    <div className="flex flex-col">
        <button
            onClick={() => window.history.go(-1)}
            className="bg-gray-200 hover:bg-gray-300 rounded !font-bold !text-5xl w-fit"
        >
            ← 
        </button>
        <h2 className="text-2xl font-bold text-gray-800"><strong>Projet : </strong>{project.title}</h2>
    </div>

    {canManage && (
        <div className="self-end md:self-auto">
            <button
                onClick={() => navigate(`/projects/edit/${project.id}`)}
                className="text-white px-4 py-2 rounded"
                style={{ backgroundColor: "#0077B6" }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}
            >
                Modifier le projet
            </button>
        </div>
    )}
</div>
            

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white shadow-sm rounded-2xl !p-4 flex flex-col flex-wrap items-start h-auto">
                    <ul className="text-md !space-y-2 list-disc list-inside p-2">
                        <li><strong>Description :</strong> {project.description}</li>
                        <li><strong>Statut :</strong> {project.status}</li>
                        
                        <li><strong>Créé par :</strong> {project.creator?.first_name} {project.creator?.last_name}</li>
                        <li><strong>Date de début :</strong> {formatDate(project.start_date)}</li>
                        <li><strong>Date de fin :</strong> {formatDate(project.end_date)}</li>

                    </ul>
                </div>


                <div className="bg-white shadow-sm rounded-2xl !p-4 flex items-center h-full">
                    <ul className="!space-y-2 p-2">
                    <li><strong>Chef de projet :</strong> {project.manager?.first_name} {project.manager?.last_name}</li>
                    <strong>Membres du projet :</strong>
                    <ul className="text-md !space-y-1 list-disc list-inside p-2">
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

                    </ul>

                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
