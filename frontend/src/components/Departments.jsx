import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api"; // Import de l'instance Axios

const Departments = () => {
    const [departments, setdepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            {departments.length > 0 ? (
                <ul>
                    {departments.map((dep) => (
                        <li key={dep.id}>
                            <p><strong>Département :</strong> {dep.name}</p>
                            <p><strong>Description d'activité :</strong> {dep.description}</p>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune depication trouvée</p>
            )}
        </div>
    );
};

export default Departments;
