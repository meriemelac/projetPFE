import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";

const EditMyProfile = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        profile_picture: null,
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get("/me");
                const user = res.data;
                setFormData({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    profile_picture: null,
                });
                setPreview(user.profile_photo_url || null);
            } catch (err) {
                console.error("Erreur chargement profil :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            const file = files[0];
            setFormData(prev => ({ ...prev, profile_picture: file }));
            setPreview(URL.createObjectURL(file));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== "") {
                    data.append(key, value);
                }
            });

            await axiosInstance.post("/update-profile", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Profil mis à jour !");
            navigate("/profile"); // redirection après succès
        } catch (err) {
            console.error("Erreur mise à jour :", err.response?.data || err.message);
            alert("Erreur lors de la mise à jour.");
        }
    };

    if (loading) return <p>Chargement du profil...</p>;

    return (
        <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Modifier mon profil</h2>

            {preview && (
                <img
                    src={preview}
                    alt="Aperçu"
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border"
                />
            )}

            <form onSubmit={handleSubmit} className="grid gap-4">
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Prénom"
                    className="border p-2"
                    required
                />
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Nom"
                    className="border p-2"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="border p-2"
                    required
                />
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Téléphone"
                    className="border p-2"
                />
                <input
                    type="file"
                    name="profile_picture"
                    accept="image/*"
                    onChange={handleChange}
                    className="border p-2"
                />

                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Enregistrer
                </button>
            </form>
        </div>
    );
};

export default EditMyProfile;
