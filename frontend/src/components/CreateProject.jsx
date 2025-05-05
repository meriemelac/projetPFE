import React, { useState, useEffect } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "planned", // valeur par défaut
        manager_id: "",
        team_id: "", // optionnel
        employee_ids: [],
    });

    const [managers, setManagers] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);


    const [error, setError] = useState("");

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await axiosInstance.get("/projects/available-managers");
                setManagers(response.data.employees);
            } catch (err) {
                console.error("Erreur lors du chargement des managers :", err);
            }
        };

        fetchManagers();
    }, []);

    useEffect(() => {
        const fetchAllEmployees = async () => {
            try {
                const response = await axiosInstance.get("/projects/available-members");
                setAllEmployees(response.data.employees);
            } catch (err) {
                console.error("Erreur chargement des employés :", err);
            }
        };

        fetchAllEmployees();
    }, []);



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

                {/* Si tu veux gérer le choix de team_id */}
                <input
                    type="number"
                    name="team_id"
                    placeholder="ID de l'équipe (optionnel)"
                    value={formData.team_id}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                />
                <select
                    multiple
                    name="employee_ids"
                    value={formData.employee_ids}
                    onChange={(e) => {
                        const selectedIds = Array.from(e.target.selectedOptions).map(option => option.value);

                        setFormData((prev) => ({ ...prev, employee_ids: selectedIds }));

                        // Trouver les objets employés correspondants
                        const selectedEmpObjects = allEmployees.filter(emp => selectedIds.includes(emp.id.toString()));
                        setSelectedMembers(selectedEmpObjects);
                    }}
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
                                        onClick={() => {
                                            // Supprimer l'employé de selectedMembers
                                            setSelectedMembers(prev => prev.filter(m => m.id !== member.id));
                                            // Supprimer l'id de formData.employee_ids
                                            setFormData(prev => ({
                                                ...prev,
                                                employee_ids: prev.employee_ids.filter(id => id !== member.id.toString())
                                            }));
                                        }}
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





                <button type="submit" className="bg-blue-600 px-4 py-2 rounded">
                    Créer le projet
                </button>
            </form>
        </div>
    );
};

export default CreateProject;
