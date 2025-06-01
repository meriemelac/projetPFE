import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";
import {
    FileUpload,
    FileUploadItemGroup,
    FileUploadItem,
    FileUploadItemPreviewImage,
    FileUploadItemDeleteTrigger,
    FileUploadHiddenInput,
    FileUploadTrigger,
    useFileUploadContext,
    Float,
} from "@chakra-ui/react";
import { LuFileImage, LuX } from "react-icons/lu";

// Composant de preview d'image uploadée
const ImageUploadPreview = ({ onSelect }) => {
    const { acceptedFiles, removeFile } = useFileUploadContext();

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            onSelect(file);
        }
    }, [acceptedFiles]);

    if (acceptedFiles.length === 0) return null;


};

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
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            navigate("/profile");
        } catch (err) {
            console.error("Erreur mise à jour :", err.response?.data || err.message);
            alert("Erreur lors de la mise à jour.");
        }
    };

    if (loading) return <p className="text-center text-gray-600">Chargement du profil...</p>;

    return (
        <div className="!px-4 !py-2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Modifier mon profil</h2>
                <button
                    onClick={() => navigate("/profile")}
                    className="text-white !text-sm px-4 py-2 rounded"
                    style={{ backgroundColor: "#0077B6" }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}
                >
                    Retour
                </button>
            </div>
            
                <div className="grid grid-cols-1 md:grid-cols-[35%_60%] gap-4">
                    {/* Carte image + upload */}
                    <div className="bg-white shadow-sm rounded-2xl !p-4 flex flex-col items-center justify-center ">
                        {preview && (
                            <img
                                src={preview}
                                alt="Aperçu"
                                className="w-40 h-40 md:w-60 md:h-60 object-cover rounded-full border-4 border-blue-500 mb-4"
                            />
                        )}
                        <div className="flex justify-center">
                            <FileUpload.Root accept="image/*">
                                <FileUploadHiddenInput />
                                <FileUploadTrigger asChild>
                                    <button className="mt-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-2">
                                        <LuFileImage />
                                        Modifier l'image du profile
                                    </button>
                                </FileUploadTrigger>

                                <ImageUploadPreview
                                    onSelect={(file) => {
                                        setFormData((prev) => ({ ...prev, profile_picture: file }));
                                        setPreview(URL.createObjectURL(file));
                                    }}
                                />
                            </FileUpload.Root>
                        </div>
                    </div>

                    {/* Carte formulaire infos */}
                    <div className="bg-white shadow-sm rounded-2xl !p-6 h-full">
                        <form onSubmit={handleSubmit} className="!space-y-4">
                            <div>
                                <label className="block text-sm !font-bold text-gray-700 mb-1">Prénom</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm !font-bold text-gray-700 mb-1">Nom</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm !font-bold text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm !font-bold text-gray-700 mb-1">Téléphone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="pt-2 flex justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate("/profile")}
                                    className="text-black !text-sm px-4 py-2 rounded"
                                    style={{ backgroundColor: "#dee2e6" }}
                                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#ced1d4")}
                                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#dee2e6")}
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    className="text-white !text-sm px-4 py-2 rounded"
                                    style={{ backgroundColor: "#0077B6" }}
                                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
                                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}
                                >
                                    Enregistrer les modifications
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            
        </div>
    );
};

export default EditMyProfile;
