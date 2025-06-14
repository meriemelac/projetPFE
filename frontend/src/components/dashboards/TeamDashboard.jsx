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

const TeamDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/dashboard/team")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Erreur chargement dashboard équipe", err));
  }, []);

  if (!data) return <p>Chargement...</p>;

  const { stats, projects, my_tasks, team_tasks, task_distribution } = data;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord – Chef d’Équipe</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Membres" value={stats.members} />
        <StatCard title="Projets" value={stats.projects} />
        <StatCard title="Tâches d’équipe" value={stats.team_tasks} />
        <StatCard title="Avancement moyen" value={`${stats.average_progress}%`} />
      </div>

      {/* Projets créés */}
      <div>
        <Typography variant="h6" className="mb-2">Mes projets</Typography>
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
              {projects.map((p) => (
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

      {/* Mes tâches */}
      <div>
        <Typography variant="h6" className="mb-2">Mes tâches</Typography>
        <TableContainer component={Paper} className="shadow rounded-xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tâche</TableCell>
                <TableCell>Projet</TableCell>
                <TableCell>Échéance</TableCell>
                <TableCell align="right">Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {my_tasks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.project?.title}</TableCell>
                  <TableCell>{t.due_date}</TableCell>
                  <TableCell align="right">{t.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Tâches de l'équipe */}
      <div>
        <Typography variant="h6" className="mb-2">Tâches de l’équipe</Typography>
        <TableContainer component={Paper} className="shadow rounded-xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tâche</TableCell>
                <TableCell>Projet</TableCell>
                <TableCell>Créée par</TableCell>
                <TableCell>Échéance</TableCell>
                <TableCell align="right">Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {team_tasks.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.project?.title}</TableCell>
                  <TableCell>{t.created_by}</TableCell>
                  <TableCell>{t.due_date}</TableCell>
                  <TableCell align="right">{t.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Répartition des tâches */}
      <div>
        <Typography variant="h6" className="mb-2">Répartition des tâches par membre</Typography>
        <TableContainer component={Paper} className="shadow rounded-xl">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="right">Nombre de tâches</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {task_distribution.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.first_name} {m.last_name}</TableCell>
                  <TableCell align="right">{m.tasks_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default TeamDashboard;
