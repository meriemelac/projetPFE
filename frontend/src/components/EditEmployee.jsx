import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/api";
import { AuthContext } from "../context/AuthContext";

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const userRole = user?.role_id;

    const [departments, setDepartments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        position: "",
        role_id: "",
        department_id: "",
        team_id: "",
        status: "",
    });

    // 🔐 Restriction d’accès
    useEffect(() => {
        if (!(userRole === "1" || userRole === "2")) {
            navigate("/unauthorized"); // rediriger vers page d’erreur
        }
    }, [userRole, navigate]);

    // 📦 Charger les données
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, depRes, roleRes] = await Promise.all([
                    axiosInstance.get(`/employees/${id}`),
                    axiosInstance.get("/departments"),
                    axiosInstance.get("/roles"),
                ]);

                const emp = empRes.data;

                setFormData({
                    first_name: emp.first_name,
                    last_name: emp.last_name,
                    email: emp.email,
                    phone: emp.phone || "",
                    position: emp.position,
                    role_id: emp.role_id,
                    department_id: emp.department_id,
                    team_id: emp.team_id || "",
                    status: emp.status,
                });

                setDepartments(depRes.data.departments);
                setRoles(roleRes.data);
            } catch (error) {
                console.error("Erreur chargement données:", error);
            }
        };

        fetchData();
    }, [id]);

    // 🎯 Charger les équipes selon le département
    useEffect(() => {
        if (formData.department_id) {
            axiosInstance
                .get(`/departments/${formData.department_id}/teams`)
                .then((res) => setTeams(res.data))
                .catch((err) => console.error("Erreur chargement équipes :", err));
        } else {
            setTeams([]);
        }
    }, [formData.department_id]);

    // 🔄 Mise à jour des champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 📨 Envoyer la mise à jour
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/employees/${id}`, formData);
            alert("Employé mis à jour avec succès !");
            navigate("/employees");
        } catch (err) {
            console.error("Erreur modification :", err);
            alert("Erreur lors de la mise à jour.");
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Modifier un employé</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
                <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Prénom" className="border p-2" required />
                <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Nom" className="border p-2" required />
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2" required />
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" className="border p-2" />
                <input name="position" value={formData.position} onChange={handleChange} placeholder="Poste" className="border p-2" required />

                <select name="role_id" value={formData.role_id} onChange={handleChange} className="border p-2" required>
                    <option value="">-- Choisir un rôle --</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.description}</option>
                    ))}
                </select>

                <select name="department_id" value={formData.department_id} onChange={handleChange} className="border p-2" required>
                    <option value="">-- Choisir un département --</option>
                    {departments.map(dep => (
                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                    ))}
                </select>

                <select name="team_id" value={formData.team_id} onChange={handleChange} className="border p-2">
                    <option value="">-- Choisir une équipe --</option>
                    {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                </select>

                <select name="status" value={formData.status} onChange={handleChange} className="border p-2" required>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                </select>

                <button type="submit" className="bg-green-600 text-black p-2 rounded">Mettre à jour</button>
                <button
                    type="button"
                    onClick={() => navigate(-1)} // revient à la page précédente
                    className="bg-gray-400 text-black p-2 rounded"
                >
                    Annuler
                </button>
            </form>
        </div>
    );
};

export default EditEmployee;
