import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/api";

const TeamDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                const response = await axiosInstance.get(`/teams/${id}`);
                setTeam(response.data);
            } catch (error) {
                setError("Erreur lors de la récupération des détails de l'équipe");
            }
        };

        fetchTeamDetails();
    }, [id]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!team) return <p>Chargement...</p>;

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
                    <h2 className="text-2xl font-bold text-gray-800">
                        <strong>Équipe : </strong>{team.name}
                    </h2>
                </div>

                <div className="self-end md:self-auto">
                    <button
                        onClick={() => navigate(`/teams/edit/${team.id}`)}
                        className="text-white px-4 py-2 rounded"
                        style={{ backgroundColor: "#0077B6" }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}
                    >
                        Modifier l'équipe
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white shadow-sm rounded-2xl !p-4 flex flex-col items-start h-auto">
                    <ul className="text-md !space-y-2 list-disc list-inside p-2">
                        <li><strong>Description :</strong> {team.description || "Aucune description"}</li>
                        <li><strong>Département :</strong> {team.department?.name || "Non spécifié"}</li>
                        <li><strong>Chef d’équipe :</strong> {team.leader?.first_name} {team.leader?.last_name}</li>
                        <li><strong>Créée par :</strong> {team.creator?.first_name} {team.creator?.last_name}</li>
                    </ul>
                </div>

                <div className="bg-white shadow-sm rounded-2xl !p-4 flex items-center h-full">
                    <ul className="!space-y-2 p-2 w-full">
                        <strong>Membres de l’équipe :</strong>
                        <ul className="text-md !space-y-1 list-disc list-inside p-2">
                            {team.employees && team.employees.length > 0 ? (
                                team.employees.map((emp) => (
                                    <li key={emp.id}>
                                        {emp.first_name} {emp.last_name} – <em>{emp.position || "Employé"}</em>
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

export default TeamDetails;
