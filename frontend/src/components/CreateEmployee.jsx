import React, { useState, useEffect } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


const CreateEmployee = () => {
    const { user } = useContext(AuthContext);
    const userRole = user?.role_id;
    const [departments, setDepartments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
        position: "",
        role_id: "",
        department_id: "",
        team_id: "",
    });

    const navigate = useNavigate();

    // Charger départements et rôles
    useEffect(() => {
        const fetchData = async () => {
            try {
                const depRes = await axiosInstance.get("/departments");
                const roleRes = await axiosInstance.get("/roles");
    
                const allRoles = roleRes.data; // tableau de rôles
    
                // 👇 filtrage en fonction du rôle connecté
                const filteredRoles = allRoles.filter(role => {
                    if (userRole === "1") return true; // admin → tous
                    if (userRole === "2") return [3, 4].includes(role.id); // chef de département → Team Leader + Employee
                    return false; // autres → aucun
                });
    
                setDepartments(depRes.data.departments);
                setRoles(filteredRoles);
    
            } catch (error) {
                console.error("Erreur chargement départements/roles :", error);
            }
        };
    
        fetchData();
    }, [userRole]); // ⬅️ important : ajouter `userRole` comme dépendance
    
    useEffect(() => {
        if (departments.length === 1) {
            setFormData(prev => ({
                ...prev,
                department_id: departments[0].id
            }));
        }
    }, [departments]);
    

    // Charger les équipes selon le département
    useEffect(() => {
        if (formData.department_id) {
            axiosInstance
                .get(`/departments/${formData.department_id}/teams`)
                .then((res) => {
                    console.log("équipes chargées :", res.data);
                    setTeams(res.data.teams || res.data); // ← adapte selon ta réponse
                })
                .catch((err) => console.error("Erreur chargement équipes :", err));
        } else {
            setTeams([]);
        }
    }, [formData.department_id]);


    // Gérer les changements de champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/employees", formData);
            alert("Employé créé avec succès !");
            navigate("/employees"); // ou une autre route
        } catch (err) {
            console.error("Erreur création employé :", err);
            alert("Erreur lors de la création.");
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Créer un nouvel employé</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
                <input name="first_name" placeholder="Prénom" onChange={handleChange} className="border p-2" required />
                <input name="last_name" placeholder="Nom" onChange={handleChange} className="border p-2" required />
                <input name="email" placeholder="Email" type="email" onChange={handleChange} className="border p-2" required />
                <input name="password" placeholder="Mot de passe" type="password" onChange={handleChange} className="border p-2" required />
                <input name="phone" placeholder="Téléphone" onChange={handleChange} className="border p-2" />
                <input name="position" placeholder="Poste" onChange={handleChange} className="border p-2" required />

                <select name="role_id" onChange={handleChange} className="border p-2" required>
                    <option value="">-- Choisir un rôle --</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.description}</option>
                    ))}
                </select>

                <select
                    name="department_id"
                    onChange={handleChange}
                    className="border p-2"
                    required
                >
                    <option value="">-- Choisir un département --</option>
                    {departments.map(dep => (
                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                    ))}
                </select>


                {teams.length > 0 && (
                    <select
                        name="team_id"
                        onChange={handleChange}
                        className="border p-2"
                    >
                        <option value="">-- Choisir une équipe --</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                )}


                <button type="submit" className="bg-blue-500 text-black p-2 rounded">Créer</button>
            </form>
        </div>
    );
};

export default CreateEmployee;
