import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api"; // Import de l'instance Axios

const MyProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get("/me"); // Requête avec axiosInstance
                setUser(response.data);
                console.log("Données utilisateur:", response.data);
            } catch (error) {
                setError(error.response?.data?.message || "Erreur lors de la récupération du profil");
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Mon Profil</h2>
            {user ? (
                <ul>
                    <li><strong>First name:</strong> {user.first_name}</li>
                    <li><strong>Last name:</strong> {user.last_name}</li>
                    <li><strong>Email:</strong> {user.email}</li>
                    <li><strong>Status:</strong> {user.status}</li>
                </ul>
            ) : (
                <p>Aucun utilisateur trouvé</p>
            )}
        </div>
    );
};

export default MyProfile;
