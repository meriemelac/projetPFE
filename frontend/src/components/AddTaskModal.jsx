import React, { useState, useEffect } from "react";
import axiosInstance from "../api/api";

function AddTaskModal({ isOpen, onClose, onTaskCreated }) {
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        due_date: "",
        project_id: "",
        employees: [],
    });
    const [error, setError] = useState("");

    // Charger les projets et employés
    useEffect(() => {
        if (isOpen) {
            axiosInstance.get("/projects").then(res => setProjects(res.data.projects));
            axiosInstance.get("/employees").then(res => setEmployees(res.data)); // à adapter à ta route réelle
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEmployeeSelect = (e) => {
        const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
        setFormData((prev) => ({ ...prev, employees: selected }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const { employees, ...taskData } = formData;
            const res = await axiosInstance.post("/tasks", taskData);

            // assignation des employés
            if (employees.length > 0) {
                await axiosInstance.post(`/tasks/${res.data.id}/assign`, {
                    employees,
                });
            }

            onTaskCreated(); // callback pour refresh Kanban
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l’ajout");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
                <h2 className="text-xl font-bold mb-4">Ajouter une tâche</h2>

                {error && <p className="text-red-500">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        name="title"
                        placeholder="Titre"
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

                    {/* <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="todo">À faire</option>
                        <option value="in_progress">En cours</option>
                        <option value="in_test">En test</option>
                        <option value="done">Terminée</option>
                    </select> */}

                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="low">Basse</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                        <option value="urgent">Urgente</option>
                    </select>

                    <input
                        type="date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />

                    <select
                        name="project_id"
                        value={formData.project_id}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    >
                        <option value="">-- Choisir un projet --</option>
                        {projects.map((proj) => (
                            <option key={proj.id} value={proj.id}>
                                {proj.title}
                            </option>
                        ))}
                    </select>

                    <select
                        multiple
                        value={formData.employees}
                        onChange={handleEmployeeSelect}
                        className="w-full border px-3 py-2 rounded"
                    >
                        {employees.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                                {emp.first_name} {emp.last_name}
                            </option>
                        ))}
                    </select>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                            Annuler
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-black rounded">
                            Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTaskModal;
