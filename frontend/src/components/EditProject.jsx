import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/api";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';


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

    const handleEmployeeToggle = (emp) => {
        const id = emp.id.toString(); // toujours stocker en string comme dans `formData`
        setFormData((prev) => {
            const updatedIds = prev.employee_ids.includes(id)
                ? prev.employee_ids.filter((eid) => eid !== id)
                : [...prev.employee_ids, id];
            return { ...prev, employee_ids: updatedIds };
        });

        setSelectedMembers((prev) => {
            const exists = prev.find((m) => m.id === emp.id);
            return exists
                ? prev.filter((m) => m.id !== emp.id)
                : [...prev, emp];
        });
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

    if (loading) return <p className="text-center text-gray-600">Chargement ...</p>;

    return (
        <div className="px-4 py-6 mx-auto">
            {/* En-tête */}
            <div className="flex flex-col mb-4">
                <button
                    onClick={() => window.history.go(-1)}
                    className="bg-gray-200 hover:bg-gray-300 rounded !font-bold !text-5xl w-fit"
                >
                    ←
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Modifier le projet</h2>
            </div>

            {/* Message d'erreur */}
            {error && (
                <p className="text-red-500 mb-4 bg-red-100 px-4 py-2 rounded">{error}</p>
            )}

            {/* Formulaire dans une carte */}
            <div className="bg-white !p-6 rounded-xl shadow border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="!space-y-4">
                            <div>
                                <label className="block !font-bold">
                                    Titre du projet
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block !font-bold">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block !font-bold">
                                    Statut
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="planned">Planned</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block !font-bold">
                                        Date de début
                                    </label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block !font-bold">
                                        Date de fin
                                    </label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="!space-y-4">
                            <div>
                                <label className="block !font-bold">
                                    Chef de projet
                                </label>
                                <select
                                    name="manager_id"
                                    value={formData.manager_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full !px-4 !py-2 border border-gray-300 rounded-md"
                                >
                                    <option className="!px-4 !py-2" value="">-- Sélectionner un manager --</option>
                                    {managers.map((manager) => (
                                        <option key={manager.id} value={manager.id}>
                                            {manager.first_name} {manager.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="!hidden">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ID de l'équipe (optionnel)
                                </label>
                                <input
                                    type="number"
                                    name="team_id"
                                    value={formData.team_id}
                                    placeholder="ID de l'équipe"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>

                                <div>
                                    <label className="block !font-bold mb-2">Membres du projet</label>
                                    <List dense sx={{
                                        width: '100%',
                                        maxHeight: 200,
                                        overflowY: 'auto',
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                        border: '1px solid #e5e7eb',
                                    }}>
                                        {allEmployees.map((emp) => {
                                            const checked = formData.employee_ids.includes(emp.id.toString());
                                            return (
                                                <ListItem
                                                    key={emp.id}
                                                    disablePadding
                                                    secondaryAction={
                                                        <Checkbox
                                                            edge="end"
                                                            onChange={() => handleEmployeeToggle(emp)}
                                                            checked={checked}
                                                        />
                                                    }
                                                >
                                                    <ListItemButton onClick={() => handleEmployeeToggle(emp)}>
                                                        <ListItemAvatar>
                                                            <Avatar src={emp.profile_photo_url}>
                                                                {emp.first_name[0]}
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={`${emp.first_name} ${emp.last_name}`} />
                                                    </ListItemButton>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </div>

                            </div>

                            <div>
                                <label className="block !font-bold mb-2">Membres sélectionnés :</label>

                                {selectedMembers.length > 0 ? (
                                    <List
                                        dense
                                        sx={{
                                            width: '100%',
                                            maxHeight: 200,
                                            overflowY: 'auto',
                                            bgcolor: 'background.paper',
                                            borderRadius: 1,
                                            border: '1px solid #e5e7eb',
                                        }}
                                    >
                                        {selectedMembers.map((member) => (
                                            <ListItem
                                                key={member.id}
                                                disablePadding
                                                secondaryAction={
                                                    <button
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className="!text-red-500 !font-bold !text-xl !px-2 hover:!text-red-700"
                                                        aria-label="Retirer"
                                                        title="Retirer ce membre"
                                                    >
                                                        −
                                                    </button>
                                                }
                                            >
                                                <ListItemButton>
                                                    <ListItemAvatar>
                                                        <Avatar src={member.profile_photo_url}>
                                                            {member.first_name[0]}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={`${member.first_name} ${member.last_name}`} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <p className="text-gray-500 text-sm">Aucun membre sélectionné.</p>
                                )}
                            </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-2 !mx-auto">
                        <button type="submit"
                            className="text-white !text-sm px-4 py-2 rounded"
                            style={{ backgroundColor: "#0077B6" }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}>
                            Enregistrer
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/projects")}
                            className="text-black !text-sm px-4 py-2 rounded"
                            style={{ backgroundColor: "#dee2e6" }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#ced1d4")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#dee2e6")}
                        >
                            Annuler
                        </button>
                    </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );

};

export default EditProject;
