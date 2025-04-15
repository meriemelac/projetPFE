import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";

const EmployeesList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axiosInstance.get("/employees");
                setEmployees(response.data);
            } catch (err) {
                setError("Erreur lors de la récupération des employés.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) return <p>Chargement des employés...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Liste des employés</h2>
            {employees.length === 0 ? (
                <p>Aucun employé trouvé.</p>
            ) : (
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="p-2 border">Prénom</th>
                            <th className="p-2 border">Nom</th>
                            <th className="p-2 border">Poste</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id} className="hover:bg-gray-50">
                                <td className="p-2 border">{emp.first_name}</td>
                                <td className="p-2 border">{emp.last_name}</td>
                                <td className="p-2 border">{emp.position}</td>
                                <td className="p-2 border">{emp.email}</td>
                                <td className="p-2 border">{emp.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EmployeesList;
