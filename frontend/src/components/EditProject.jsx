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
        status: "planned",
        manager_id: "",
        team_id: "",
        employee_ids: [],
    });

    const [managers, setManagers] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axiosInstance.get(`/projects/${id}`);
                const { title, description, start_date, end_date, status, manager_id, team_id } = response.data.project;
                setFormData(prev => ({
                    ...prev,
                    title, description, start_date, end_date, status,
                    manager_id, team_id: team_id ?? ""
                }));
            } catch (err) {
                setError("Erreur lors du chargement du projet.");
            } finally {
                setLoading(false);
            }
        };

        const fetchManagers = async () => {
            try {
                const response = await axiosInstance.get("/projects/available-managers");
                setManagers(response.data.employees);
            } catch (err) {
                console.error("Erreur chargement des managers :", err);
            }
        };

        const fetchMembers = async () => {
            try {
                const response = await axiosInstance.get(`/projects/${id}/members`);
                setSelectedMembers(response.data.members);
                setFormData(prev => ({
                    ...prev,
                    employee_ids: response.data.members.map(m => m.id.toString())
                }));
            } catch (err) {
                console.error("Erreur chargement des membres du projet :", err);
            }
        };

        const fetchAllEmployees = async () => {
            try {
                const response = await axiosInstance.get("/projects/available-members");
                setAllEmployees(response.data.employees);
            } catch (err) {
                console.error("Erreur chargement des employés :", err);
            }
        };

        fetchProject();
        fetchManagers();
        fetchMembers();
        fetchAllEmployees();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEmployeeSelect = (e) => {
        const selectedIds = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData(prev => ({ ...prev, employee_ids: selectedIds }));
        const selectedEmpObjects = allEmployees.filter(emp => selectedIds.includes(emp.id.toString()));
        setSelectedMembers(selectedEmpObjects);
    };

    const handleRemoveMember = (memberId) => {
        setSelectedMembers(prev => prev.filter(m => m.id !== memberId));
        setFormData(prev => ({
            ...prev,
            employee_ids: prev.employee_ids.filter(id => id !== memberId.toString())
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await axiosInstance.put(`/projects/${id}`, formData);
            navigate("/projects");
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour du projet.");
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
                    placeholder="Titre du projet"
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
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="planned">Planned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
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
                <select
                    name="manager_id"
                    value={formData.manager_id}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                >
                    <option value="">-- Sélectionner un manager --</option>
                    {managers.map((manager) => (
                        <option key={manager.id} value={manager.id}>
                            {manager.first_name} {manager.last_name}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    name="team_id"
                    value={formData.team_id}
                    placeholder="ID de l'équipe (optionnel)"
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />

                <select
                    multiple
                    name="employee_ids"
                    value={formData.employee_ids}
                    onChange={handleEmployeeSelect}
                    className="w-full border px-3 py-2 rounded"
                >
                    {allEmployees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                            {emp.first_name} {emp.last_name}
                        </option>
                    ))}
                </select>

                <div className="mt-4">
                    <h4 className="font-semibold">Membres sélectionnés :</h4>
                    {selectedMembers.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {selectedMembers.map(member => (
                                <li key={member.id} className="flex items-center justify-between">
                                    <span>{member.first_name} {member.last_name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="text-red-500 text-sm ml-2"
                                    >
                                        Supprimer
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Aucun membre sélectionné.</p>
                    )}
                </div>

                <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded">
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
        </div>
    );
};

export default EditProject;
