import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api"; // Import de l'instance Axios

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axiosInstance.get("/notifications");
                setNotifications(response.data.notifications); // on extrait le tableau
                console.log("Notifications reçues:", response.data.notifications);
            } catch (error) {
                setError(error.response?.data?.message || "Erreur lors de la récupération des notifications");
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Mes Notifications</h2>
            {notifications.length > 0 ? (
                <ul>
                    {notifications.map((notif) => (
                        <li key={notif.id}>
                            <p><strong>Titre :</strong> {notif.title}</p>
                            <p><strong>Message :</strong> {notif.message}</p>
                            <p><strong>Date :</strong> {new Date(notif.created_at).toLocaleString()}</p>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune notification trouvée</p>
            )}
        </div>
    );
};

export default Notifications;
