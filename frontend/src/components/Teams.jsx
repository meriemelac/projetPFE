import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axiosInstance.get("/teams");
                setTeams(response.data.teams);
            } catch (error) {
                setError("Erreur lors de la récupération des équipes");
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Liste des Équipes</h2>
            <ul>
                {teams.map((team) => (
                    <li key={team.id} style={{ marginBottom: "1rem" }}>
                        <p><strong>{team.name}</strong></p>
                        <button onClick={() => navigate(`/teams/${team.id}`)}>
                            Voir les détails
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Teams;
