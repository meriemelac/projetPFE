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
    <div className="px-4 py-6 mx-auto">
      <div className="flex flex-col mb-4">
        <button
          onClick={() => window.history.go(-1)}
          className="bg-gray-200 hover:bg-gray-300 rounded !font-bold !text-5xl w-fit"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Créer une nouvelle équipe</h2>
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
              Ajouter
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

export default CreateTeam;
