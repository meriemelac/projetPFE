import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/api";

const EditDepartment = () => {
  const { id } = useParams(); // Récupère l'ID du département
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données du département
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axiosInstance.get(`/departments/${id}`);
        setFormData({
          name: response.data.department.name || "",
          description: response.data.department.description || ""
        });
      } catch (err) {
        setError("Impossible de charger le département.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axiosInstance.put(`/departments/${id}`, formData);
      navigate("/departments");
    } catch (err) {
      setError("Erreur lors de la mise à jour du département.");
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
        <h2 className="text-2xl font-bold text-gray-800">Modifier un département</h2>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <div className="bg-white rounded px-4 py-4 shadow">
        <form onSubmit={handleSubmit} className="!space-y-4">
          <div>
            <label className="block !font-bold">Nom du département</label>
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

          <div className="flex justify-end gap-2">
            <button type="submit"
              className="text-white !text-sm px-4 py-2 rounded"
              style={{ backgroundColor: "#0077B6" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}>
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => navigate("/departments")}
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

export default EditDepartment;
