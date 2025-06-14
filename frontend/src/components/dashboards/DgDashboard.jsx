import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/api";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({ title, value }) => (
  <Card className="shadow rounded-xl">
    <CardContent>
      <Typography variant="h6" color="textSecondary">{title}</Typography>
      <Typography variant="h4" fontWeight="bold">{value}</Typography>
    </CardContent>
  </Card>
);

const DgDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/dashboard/dg")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Erreur chargement dashboard DG", err));
  }, []);

  if (!data) return <p>Chargement...</p>;

  const { stats, top_projects, upcoming_deadlines, project_progress_list, project_evolution } = data;

  // Vérification de la structure du JSON pour éviter les erreurs
  const chartData = Array.isArray(project_evolution?.created)
    ? project_evolution.created.map((createdItem) => {
      const completedItem = (project_evolution.completed || []).find(
        (c) => c.month === createdItem.month
      );

      return {
        month: new Date(createdItem.month).toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        created: parseInt(createdItem.total, 10),
        completed: completedItem ? parseInt(completedItem.total, 10) : 0,
      };
    })
    : [];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord – Directeur Général</h1>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Employés" value={stats.employees} />
        <StatCard title="Départements" value={stats.departments} />
        <StatCard title="Équipes" value={stats.teams} />
        <StatCard title="Projets" value={stats.projects} />
      </div>

      {/* Top 5 projets */}
      <div>
        <Typography variant="h6" className="mb-2">Top 5 projets avec le plus de membres</Typography>
        <TableContainer component={Paper} className="shadow rounded-xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Projet</TableCell>
                <TableCell align="right">Membres</TableCell>
                <TableCell align="right">Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(top_projects || []).map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell align="right">{p.members_count}</TableCell>
                  <TableCell align="right">{p.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Projets proches de la deadline */}
      <div>
        <Typography variant="h6" className="mb-2">Projets proches de la date limite</Typography>
        <TableContainer component={Paper} className="shadow rounded-xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Projet</TableCell>
                <TableCell>Date limite</TableCell>
                <TableCell align="right">Jours restants</TableCell>
                <TableCell align="right">Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(upcoming_deadlines || []).map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>{p.end_date}</TableCell>
                  <TableCell align="right">{p.days_left} jours</TableCell>
                  <TableCell align="right">{p.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Taux d'avancement par projet */}
      <div>
        <Typography variant="h6" className="mb-2">Taux d'avancement des projets</Typography>
        <TableContainer component={Paper} className="shadow rounded-xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Projet</TableCell>
                <TableCell>Début</TableCell>
                <TableCell>Fin</TableCell>
                <TableCell align="right">Statut</TableCell>
                <TableCell align="right">Avancement</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(project_progress_list || []).map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>{p.start_date}</TableCell>
                  <TableCell>{p.end_date}</TableCell>
                  <TableCell align="right">{p.status}</TableCell>
                  <TableCell align="right">{p.progress}%</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </div>

      {/* Graphique d'évolution des projets */}
      <div className="bg-white p-6 rounded-xl shadow">
        <Typography variant="h6" className="mb-4">Évolution des projets (créés vs terminés)</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="created" stroke="#8884d8" name="Créés" />
            <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Terminés" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DgDashboard;