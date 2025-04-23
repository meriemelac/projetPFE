// src/pages/EditTeam.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/api";

const EditTeam = () => {
  const { id } = useParams(); // ID de l’équipe à modifier
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department_id: ""
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les infos de l'équipe + départements
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
      setError("Erreur lors de la mise à jour.");
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

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Modifier l'équipe</h2>

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

        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Enregistrer
          </button>
          <button
            type="button"
            onClick={() => navigate("/teams")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Retour
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded ml-auto"
          >
            Supprimer
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTeam;
