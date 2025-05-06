import React, { useEffect, useState, useContext, useMemo } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
    MantineReactTable,
    useMantineReactTable,
} from 'mantine-react-table';
import { Box, Text } from '@mantine/core';

const EmployeesList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const userRole = user?.role_id;


    // Charger les employés depuis l’API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axiosInstance.get('/employees');
                setData(response.data);
            } catch (err) {
                console.error('Erreur API :', err);
                setError("Impossible de charger les employés.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);
    // Colonnes de la table
    const columns = useMemo(() => [
        {
            accessorKey: 'first_name',
            header: 'Prénom',
        },
        {
            accessorKey: 'last_name',
            header: 'Nom',
        },
        {
            accessorKey: 'position',
            header: 'Poste',
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'status',
            header: 'Statut',
            Cell: ({ cell }) => (
                <Text
                    fw="bold"
                    c={cell.getValue() === 'active' ? 'green' : 'red'}
                >
                    {cell.getValue() === 'active' ? 'Actif' : 'Inactif'}
                </Text>
            ),
        },
        {
            header: 'Actions',
            Cell: ({ row }) => {
                if (!(userRole === "1" || userRole === "2")) return null;

                return (
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate(`/employees/${row.original.id}/edit`)}
                            className="text-blue-600 hover:underline"
                        >
                            ✏️ Modifier
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:underline"
                        >
                            🗑️ Supprimer
                        </button>
                    </div>
                );
            }
        },
    ], [navigate]);

    // Configuration de la table
    const table = useMantineReactTable({
        columns,
        data,
        enableColumnFilters: false,
        enableSorting: true,
        enablePagination: true,
        initialState: {
            density: 'xs',
        },
    });

    const handleDelete = async (employeeId) => {
        const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?");
        if (!confirm) return;
      
        try {
          await axiosInstance.delete(`/employees/${employeeId}`);
          setData(prev => prev.filter(emp => emp.id !== employeeId));
          alert("Employé supprimé avec succès !");
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          alert("Une erreur s'est produite pendant la suppression.");
        }
      };

      
    // Gestion chargement/erreur
    if (loading) return <p>Chargement des employés...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4">
            {(userRole === "1" || userRole === "2") && (
                <button
                    onClick={() => navigate(`/employees/create`)}
                    className="bg-blue-500 text-black px-4 py-2 rounded mb-4"
                >
                    + Ajouter un nouvel employé
                </button>
            )}


            <Box p="md">
                <MantineReactTable table={table} />
            </Box>

        </div>
    );
};

export default EmployeesList;
