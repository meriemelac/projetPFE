import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const Departments = () => {
    const [departments, setdepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();


    const roleId = user?.role_id;
    const canManage = ["1", "2", "3"].includes(roleId);


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
                setdepartments(response.data.departments);
                console.log("departments reçus:", response.data.departments);
            } catch (error) {
                setError(error.response?.data?.message || "Erreur lors de la récupération des départements");
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchdepartments();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Chargement...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="px-4 py-6  mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4 !md:mb-6">
                <div className="flex flex-col">
                    <button
                        onClick={() => window.history.go(-1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded !font-bold !text-5xl w-fit"
                    >
                        ←
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Départements</h2>
                </div>

                {canManage && (
                    <div className="self-end md:self-auto">
                        <button
                            onClick={() => navigate("/departments/create")}
                            className="text-white !text-sm px-4 py-2 rounded"
                            style={{ backgroundColor: "#0077B6" }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}
                        >
                            + Ajouter un département
                        </button>
                    </div>
                )}
            </div>


            {departments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {departments.map((dep) => (
                        <div
                            key={dep.id}
                            className="bg-white p-4 rounded-lg shadow border border-gray-100"
                        >
                            <h3 className="text-lg font-semibold text-gray-700">{dep.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">
                                <span className="font-medium">Description :</span> {dep.description}
                            </p>

                            {canManage && (
                                <div className="mt-4 flex gap-3 justify-end">
                                    <button
                                        onClick={() => navigate(`/departments/edit/${dep.id}`)}
                                        className="text-white text-sm rounded !px-2 py-2"
                                        style={{ backgroundColor: "#1fb06d" }}
                                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#23c47a")}
                                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#1fb06d")}
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dep.id)}
                                        className="text-white text-sm rounded !px-2 py-2"
                                        style={{ backgroundColor: "#dc3545" }}
                                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#ec5c6a")}
                                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc3545")}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-6">Aucun département trouvé.</p>
            )}
        </div>
    );
};

export default Departments;
