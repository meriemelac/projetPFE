import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const roleId = user?.role_id;
  const canManage = ["1", "2"].includes(roleId);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axiosInstance.get("/teams");
        setTeams(res.data.teams);
      } catch (error) {
        setError("Erreur lors du chargement des équipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette équipe ?")) return;

    try {
      await axiosInstance.delete(`/teams/${id}`);
      setTeams((prev) => prev.filter((team) => team.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression de l’équipe.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Chargement ...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="px-4 py-6 mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
    <div className="flex flex-col">
        <button
            onClick={() => window.history.go(-1)}
            className="bg-gray-200 hover:bg-gray-300 rounded !font-bold !text-5xl w-fit"
        >
            ← 
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Liste des Équipes</h2>
    </div>

    {canManage && (
        <div className="self-end md:self-auto">
            <button
                onClick={() => navigate("/teams/create")}
                className="text-white  px-4 py-2 rounded"
                style={{ backgroundColor: "#0077B6" }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}
            >
                + Ajouter une équipe
            </button>
        </div>
    )}
</div>


     {teams.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    {teams.map((team) => (
      <div
        key={team.id}
        className="bg-white p-4 rounded-lg shadow border border-gray-100"
      >
        <h3 className="text-lg font-semibold">{team.name}</h3>
        <p className="text-sm mt-1">
          <span className="font-medium">Département :</span> {team.department?.name || "N/A"}... 
          <button
            onClick={() => navigate(`/teams/${team.id}`)}
            style={{ color: "#0077B6" }}
            className="!text-blue rounded px-1 hover:underline"
          >
             Voir les détails
          </button>
        </p>

        <div className="mt-2 flex gap-3 justify-end flex-wrap">

          {user && (user.role_id === "1" || (user.role_id === "2" && user.department_id === team.department_id)) && (
            <>
              <button
                onClick={() => navigate(`/teams/edit/${team.id}`)}
                className="text-white text-sm rounded !px-2 py-2"
                style={{ backgroundColor: "#1fb06d" }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#23c47a")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#1fb06d")}
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(team.id)}
                className="text-white text-sm rounded !px-2 py-2"
                style={{ backgroundColor: "#dc3545" }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#ec5c6a")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc3545")}
              >
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-gray-500 text-center mt-6">Aucune équipe trouvée.</p>
)}

    </div>
  );
};

export default Teams;
