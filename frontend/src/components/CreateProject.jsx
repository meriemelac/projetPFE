import React, { useState } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await axiosInstance.post("/projects", formData);
            navigate("/projects");
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création du projet");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Créer un nouveau projet</h2>

            {error && <p className="text-red-600 mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Titre du projet"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Créer le projet
                </button>
            </form>
        </div>
    );
};

export default CreateProject;
