import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";
import imageprofile from "../assets/1.png";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get("/me");
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

    if (loading) return <p className="text-center text-gray-600">Chargement du profil...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="!px-4 !py-2">
            <div className="flex justify-end mb-2">
                <button
                    onClick={() => navigate("/edit-my-profile")}
                    className="text-white !text-sm px-4 py-2 rounded"
                    style={{ backgroundColor: "#0077B6" }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}
                >
                    Modifier mon profil
                </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user ? (
                    <>
                        {/* Carte image + nom */}
                        <div className="bg-white shadow-sm rounded-2xl !p-4 flex flex-col md:flex-row items-center h-auto">
                            <img
                                src={user.profile_photo_url || imageprofile}
                                alt="Photo de profil"
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    border: "2px solid #0077B6",
                                    margin: "auto 0",
                                }}
                            />
                            <div className="!mt-4 md:mt-0 md:!ml-6 text-center md:text-left">
                                <h2 className="!text-4xl font-bold">{user.first_name}</h2>
                                <h2 className="!text-4xl font-bold">{user.last_name}</h2>
                            </div>
                        </div>


                        {/* Carte d'infos */}
                        <div className="bg-white shadow-sm rounded-2xl p-6 flex items-center h-60">
                            <ul className="!text-md !space-y-1">
                                <li><strong>Email :</strong> {user.email}</li>
                                <li><strong>Téléphone :</strong> {user.phone}</li>
                                <li><strong>Poste :</strong> {user.position}</li>

                                {user.department && (
                                    <li><strong>Département :</strong> {user.department}</li>
                                )}

                                {user.team && (
                                    <li><strong>Équipe :</strong> {user.team}</li>
                                )}

                                {/* <li><strong>Date d’embauche :</strong> {user.hire_date}</li> */}
                            </ul>

                        </div>


                        {/* 🆕 Troisième carte pleine largeur */}
                        <div className="bg-white shadow-sm rounded-2xl !p-6 md:col-span-2 h-60">
                            <p className="text-lg font-medium">
                                Ceci est une carte supplémentaire qui occupe toute la largeur sur deux colonnes.

                                ici je vais ajouter les projets sur les quells l'utilisateur travaile ou bien worked
                            </p>
                        </div>
                    </>
                ) : (
                    <p>Aucun utilisateur trouvé</p>
                )}
            </div>
        </div>
    );
};

export default MyProfile;
