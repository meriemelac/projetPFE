import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api"; // Import de l'instance Axios

const Teams = () => {
    const [teams, setteams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchteams = async () => {
            try {
                const response = await axiosInstance.get("/teams");
                setteams(response.data.teams); // on extrait le tableau
                console.log("teams reçues:", response.data.teams);
            } catch (error) {
                setError(error.response?.data?.message || "Erreur lors de la récupération des teams");
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchteams();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>teams</h2>
            {teams.length > 0 ? (
                <ul>
                    {teams.map((team) => (
                        <li key={team.id}>
                            <p><strong>team :</strong> {team.name}</p>
                            <p><strong>Description du team :</strong> {team.description}</p>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune team trouvée</p>
            )}
        </div>
    );
};

export default Teams;
