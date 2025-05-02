import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/api";

const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
    });

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axiosInstance.get(`/projects/${id}`);
                const { title, description, start_date, end_date } = response.data.project;
                setFormData({ title, description, start_date, end_date });
            } catch (err) {
                setError("Erreur lors du chargement du projet.");
            } finally {
                setLoading(false);
            }
        };

        const fetchMembers = async () => {
            try {
                const response = await axiosInstance.get(`/projects/${id}/members`);
                setMembers(response.data.members);
            } catch (err) {
                console.error("Erreur chargement des membres.");
            }
        };

        fetchProject();
        fetchMembers();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await axiosInstance.put(`/projects/${id}`, formData);
            navigate("/projects");
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour.");
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Modifier le projet</h2>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Titre"
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
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

                <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
                    Enregistrer les modifications
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/projects")}
                    className="ml-2 bg-gray-300 text-black px-4 py-2 rounded"
                >
                    Annuler
                </button>
            </form>

            <div className="mt-6">
                <h3 className="font-semibold mb-2">Membres affectés :</h3>
                {members.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {members.map((member) => (
                            <li key={member.id}>
                                {member.first_name} {member.last_name} —{" "}
                                <em>{member.pivot?.role || "Membre"}</em>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucun membre affecté.</p>
                )}
            </div>
        </div>
    );
};

export default EditProject;
