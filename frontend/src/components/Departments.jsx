import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api"; // Import de l'instance Axios
import { useNavigate } from "react-router-dom";

const Departments = () => {
    const [departments, setdepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get("/me").then(res => setUser(res.data));
    }, []);


    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce département ?")) return;

        try {
            await axiosInstance.delete(`/departments/${id}`);
            setdepartments(departments.filter(dep => dep.id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression du département");
            console.error(err);
        }
    };


    useEffect(() => {
        const fetchdepartments = async () => {
            try {
                const response = await axiosInstance.get("/departments");
                setdepartments(response.data.departments); // on extrait le tableau
                console.log("departments reçues:", response.data.departments);
            } catch (error) {
                setError(error.response?.data?.message || "Erreur lors de la récupération des departments");
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchdepartments();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Departments</h2>
            {user?.role_id === "1" && (
            <button
                onClick={() => navigate("/departments/create")}
                className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
                + Ajouter un département
            </button>)}

            {departments.length > 0 ? (
                <ul>
                    {departments.map((dep) => (
                        <li key={dep.id}>
                            <p><strong>Département :</strong> {dep.name}</p>
                            <p><strong>Description d'activité :</strong> {dep.description}</p>

                            {/* Supprimer (si admin uniquement) */}
                            {user?.role_id === "1" && (
                                <div>
                                <button
                                onClick={() => navigate(`/departments/edit/${dep.id}`)}
                                className="text-blue-500 hover:underline ml-2"
                              >
                                Modifier
                              </button>
                                <button onClick={() => handleDelete(dep.id)}>Supprimer</button>
                                </div>
                            )}

                            <hr />
                        </li>
                    ))}

                </ul>
            ) : (
                <p>Aucun département trouvé</p>
            )}
        </div>
    );
};

export default Departments;
