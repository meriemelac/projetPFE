import React, { useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
} from 'mantine-react-table';
import { Box, Text } from '@mantine/core';
import axiosInstance from '../api/api';

const Test = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  ], []);

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

  // Gestion chargement/erreur
  if (loading) return <p>Chargement des employés...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Affichage de la table
  return (
    <Box p="md">
      <MantineReactTable table={table} />
    </Box>
  );
};

export default Test;
