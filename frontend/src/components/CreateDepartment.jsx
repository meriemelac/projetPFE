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
    <div className="px-4 py-6  mx-auto">
      <div className="flex flex-col mb-4">
        <button
          onClick={() => window.history.go(-1)}
          className="bg-gray-200 hover:bg-gray-300 rounded !font-bold !text-5xl w-fit"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Créer un nouveau département</h2>
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
              Ajouter
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

export default CreateDepartment;
