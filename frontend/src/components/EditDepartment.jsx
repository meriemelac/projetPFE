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

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Modifier le département</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Nom du département</label>
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

        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-black px-4 py-2 rounded">
            Enregistrer
          </button>
          <button
            type="button"
            onClick={() => navigate("/departments")}
            className="bg-gray-500 text-black px-4 py-2 rounded"
          >
            Retour
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDepartment;
