import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axiosInstance.get("/notifications");
                setNotifications(response.data.notifications);
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

    const markAsRead = async (id) => {
        try {
            await axiosInstance.patch(`/notifications/${id}/read`);
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === id ? { ...notif, is_read: true } : notif
                )
            );
        } catch (error) {
            console.error("Erreur lors du marquage comme lu:", error);
        }
    };

    const deleteNotification = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette notification ?")) return;

        try {
            await axiosInstance.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(notif => notif.id !== id));
        } catch (error) {
            alert("Erreur lors de la suppression de la notification.");
        }
    };

    if (loading) return <p className="text-center text-gray-600">Chargement...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="px-4 py-6 mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-6">
                <div className="flex flex-col">
                    <button
                        onClick={() => window.history.go(-1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded !font-bold !text-5xl w-fit"
                    >
                        ←
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Mes Notifications</h2>
                </div>
            </div>

            {notifications.length > 0 ? (
                <div className="!space-y-4">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`bg-white p-3 rounded-lg shadow border ${
                                notif.is_read ? 'border-gray-100' : 'border-blue-200 bg-blue-50'
                            }`}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {notif.title}
                                        </h3>
                                        {!notif.is_read && (
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                Nouveau
                                            </span>
                                        )}
                                    </div>
                                    
                                    <p className="text-gray-600 mb-3 leading-relaxed">
                                        {notif.message}
                                    </p>
                                    
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Date :</span> {' '}
                                        {new Date(notif.created_at).toLocaleString('fr-FR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 shrink-0">
                                    {!notif.is_read && (
                                        <button
                                            onClick={() => markAsRead(notif.id)}
                                            className="text-white text-sm rounded px-3 py-1"
                                            style={{ backgroundColor: "#0077B6" }}
                                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
                                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}
                                        >
                                            Marquer comme lu
                                        </button>
                                    )}
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔔</div>
                    <p className="text-gray-500 text-lg">Aucune notification trouvée</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Vous serez notifié ici des nouvelles activités
                    </p>
                </div>
            )}
        </div>
    );
};

export default Notifications;