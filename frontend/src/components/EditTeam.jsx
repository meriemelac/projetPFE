import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/api";

const EditTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department_id: ""
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resTeam = await axiosInstance.get(`/teams/${id}`);
        setFormData({
          name: resTeam.data.name,
          description: resTeam.data.description || "",
          department_id: resTeam.data.department_id
        });

        const resDepartments = await axiosInstance.get("/departments");
        setDepartments(resDepartments.data.departments);
      } catch (err) {
        setError("Erreur lors du chargement de l’équipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axiosInstance.put(`/teams/${id}`, formData);
      navigate("/teams");
    } catch (err) {
      setError("Erreur lors de la mise à jour de l’équipe.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette équipe ?")) return;
    try {
      await axiosInstance.delete(`/teams/${id}`);
      navigate("/teams");
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Chargement ...</p>;

  return (
    <div className="px-4 py-6 mx-auto">
      <div className="flex flex-col mb-4">
        <button
          onClick={() => window.history.go(-1)}
          className="bg-gray-200 hover:bg-gray-300 rounded !font-bold !text-5xl w-fit"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Modifier une équipe</h2>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white rounded px-4 py-4 shadow">
        <form onSubmit={handleSubmit} className="!space-y-4">
          <div>
            <label className="block !font-bold">Nom de l’équipe</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block !font-bold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            ></textarea>
          </div>

          <div>
            <label className="block !font-bold">Département</label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">-- Sélectionner --</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="text-white !text-sm px-4 py-2 rounded"
              style={{ backgroundColor: "#0077B6" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => navigate("/teams")}
              className="text-black !text-sm px-4 py-2 rounded"
              style={{ backgroundColor: "#dee2e6" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#ced1d4")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#dee2e6")}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeam;
