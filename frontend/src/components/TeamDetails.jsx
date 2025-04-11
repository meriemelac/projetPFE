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
        <div>
            <h2>Détails de l'équipe : {team.name}</h2>
            <p><strong>Description :</strong> {team.description}</p>
            <p><strong>Département :</strong> {team.department?.name}</p>

            <h4>Membres de l'équipe :</h4>
            {team.employees && team.employees.length > 0 ? (
                <ul>
                    {team.employees.map((emp) => (
                        <li key={emp.id}>
                            {emp.first_name} {emp.last_name} – {emp.position}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun membre trouvé.</p>
            )}

            <button onClick={() => navigate("/teams")} style={{ marginTop: "20px" }}>
                Retour
            </button>
        </div>
    );
};

export default TeamDetails;
