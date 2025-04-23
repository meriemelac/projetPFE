import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération utilisateur
        const userRes = await axiosInstance.get("/me");
        setUser(userRes.data);

        // Récupération des équipes
        const teamRes = await axiosInstance.get("/teams");
        setTeams(teamRes.data.teams);
      } catch (error) {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette équipe ?")) return;

    try {
      await axiosInstance.delete(`/teams/${id}`);
      setTeams(teams.filter((team) => team.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression de l’équipe.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Liste des Équipes</h2>

      {/* Ajouter équipe (admin ou chef de département) */}
      {user && (user.role_id === "1" || user.role_id === "2") && (
        <button
          onClick={() => navigate("/teams/create")}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Ajouter une équipe
        </button>
      )}

      <ul>
        {teams.map((team) => (
          <li key={team.id} className="mb-4 border p-3 rounded">
            <p className="font-semibold">{team.name}</p>
            <p className="text-sm text-gray-600">
              Département : {team.department?.name || "N/A"}
            </p>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => navigate(`/teams/${team.id}`)}
                className="text-blue-500 hover:underline"
              >
                Voir les détails
              </button>

              {/* Modifier / Supprimer (admin ou chef du département) */}
              {user && (user.role_id === "1" || (user.role_id === "2" && user.department_id === team.department_id)) && (
                <>
                  <button
                    onClick={() => navigate(`/teams/edit/${team.id}`)}
                    className="text-green-600 hover:underline"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className="text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Teams;
