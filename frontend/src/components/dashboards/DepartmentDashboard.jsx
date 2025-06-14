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

const StatCard = ({ title, value }) => (
  <Card className="shadow rounded-xl">
    <CardContent>
      <Typography variant="h6" color="textSecondary">{title}</Typography>
      <Typography variant="h4" fontWeight="bold">{value}</Typography>
    </CardContent>
  </Card>
);

const DepartmentLeaderDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/dashboard/department")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Erreur chargement dashboard Département", err));
  }, []);

  if (!data) return <p>Chargement...</p>;

  const { stats, projects, project_progress_list, task_distribution } = data;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord – Chef de Département</h1>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Employés" value={stats.employees} />
        <StatCard title="Équipes" value={stats.teams} />
        <StatCard title="Projets" value={stats.projects} />
        <StatCard title="Tâches" value={stats.tasks} />
      </div>

      {/* Liste des projets avec avancement */}
      <div>
        <Typography variant="h6" className="mb-2">Projets du département</Typography>
        <TableContainer component={Paper} className="shadow rounded-xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Projet</TableCell>
                <TableCell>Début</TableCell>
                <TableCell>Fin</TableCell>
                <TableCell align="right">Statut</TableCell>
                <TableCell align="right">Progression</TableCell>
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

      {/* Répartition des tâches par équipe */}
      <div>
        <Typography variant="h6" className="mb-2">Répartition des tâches par équipe</Typography>
        <TableContainer component={Paper} className="shadow rounded-xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Équipe</TableCell>
                <TableCell align="right">Nombre de tâches</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(task_distribution || []).map((equipe) => (
                <TableRow key={equipe.id}>
                  <TableCell>{equipe.name}</TableCell>
                  <TableCell align="right">{equipe.tasks_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default DepartmentLeaderDashboard;
