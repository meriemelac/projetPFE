import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/api";

const CreateDepartment = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axiosInstance.post("/departments", formData);
      navigate("/departments"); // redirection vers la liste
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Créer un nouveau département</h2>

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
          <button type="submit" className="bg-green-600 text-black px-4 py-2 rounded">
            Ajouter
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

export default CreateDepartment;
