import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/api";

const CreateTeam = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department_id: ""
  });

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axiosInstance.get("/departments");
        setDepartments(res.data.departments);
      } catch (err) {
        setError("Erreur lors du chargement des départements");
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axiosInstance.post("/teams", formData);
      navigate("/teams");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Créer une nouvelle équipe</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Nom de l’équipe</label>
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
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          ></textarea>
        </div>

        <div>
          <label className="block font-semibold">Département</label>
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

        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Ajouter
          </button>
          <button
            type="button"
            onClick={() => navigate("/teams")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Retour
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeam;
