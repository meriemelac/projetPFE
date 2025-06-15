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
  Box,
  Chip,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Groups as GroupsIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const StatCard = ({ title, value, icon, color, bgColor }) => (
  <Card 
    sx={{ 
      background: `linear-gradient(135deg, ${bgColor} 0%, ${color} 100%)`,
      color: 'white',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      }
    }}
    className="shadow-lg rounded-xl"
  >
    <CardContent sx={{ position: 'relative', overflow: 'hidden' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Avatar 
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            width: 56, 
            height: 56,
            backdropFilter: 'blur(10px)'
          }}
        >
          {icon}
        </Avatar>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.1)',
        }}
      />
    </CardContent>
  </Card>
);

const StatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'terminé':
      case 'completed':
        return { color: 'success', variant: 'filled' };
      case 'en cours':
      case 'in_progress':
        return { color: 'warning', variant: 'filled' };
      case 'en attente':
      case 'pending':
        return { color: 'info', variant: 'filled' };
      case 'annulé':
      case 'cancelled':
        return { color: 'error', variant: 'filled' };
      default:
        return { color: 'default', variant: 'outlined' };
    }
  };

  const { color, variant } = getStatusColor(status);
  return <Chip label={status} color={color} variant={variant} size="small" />;
};

const ProgressBar = ({ progress }) => (
  <Box display="flex" alignItems="center" gap={1}>
    <Box width="100px">
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{
          height: 8,
          borderRadius: 4,
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            background: progress < 30 ? '#f44336' : progress < 70 ? '#ff9800' : '#4caf50'
          }
        }}
      />
    </Box>
    <Typography variant="body2" fontWeight="bold" color="primary">
      {progress}%
    </Typography>
  </Box>
);

const DgDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/dashboard/dg")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Erreur chargement dashboard DG", err));
  }, []);

  if (!data) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
      <Typography variant="h6" color="primary">Chargement...</Typography>
    </Box>
  );

  const { stats, top_projects, upcoming_deadlines, project_progress_list, project_evolution } = data;

  // Préparation des données pour le graphique en barres
  const chartData = Array.isArray(project_evolution?.created)
    ? project_evolution.created.map((createdItem) => {
      const completedItem = (project_evolution.completed || []).find(
        (c) => c.month === createdItem.month
      );

      return {
        month: new Date(createdItem.month).toLocaleString("fr-FR", {
          month: "short",
          year: "numeric",
        }),
        created: parseInt(createdItem.total, 10),
        completed: completedItem ? parseInt(completedItem.total, 10) : 0,
      };
    })
    : [];

  const barColors = ['#3f51b5', '#4caf50'];

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        sx={{ 
          mb: 4, 
          background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
      Tableau de bord – Directeur Général
      </Typography>

      {/* Statistiques générales avec couleurs */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3, mb: 4 }}>
        <StatCard 
          title="Employés" 
          value={stats.employees} 
          icon={<PeopleIcon />}
          color="#1976d2"
          bgColor="#42a5f5"
        />
        <StatCard 
          title="Départements" 
          value={stats.departments} 
          icon={<BusinessIcon />}
          color="#388e3c"
          bgColor="#66bb6a"
        />
        <StatCard 
          title="Équipes" 
          value={stats.teams} 
          icon={<GroupsIcon />}
          color="#f57c00"
          bgColor="#ffa726"
        />
        <StatCard 
          title="Projets" 
          value={stats.projects} 
          icon={<AssignmentIcon />}
          color="#7b1fa2"
          bgColor="#ab47bc"
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4, mb: 4 }}>
        {/* Top 5 projets */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <TrendingUpIcon color="primary" />
            <Typography variant="h6" color="primary" fontWeight="bold">
               Top 5 projets avec le plus de membres
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { bgcolor: '#f5f5f5', fontWeight: 'bold' } }}>
                  <TableCell>Projet</TableCell>
                  <TableCell align="center">Membres</TableCell>
                  <TableCell align="center">Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(top_projects || []).map((p, index) => (
                  <TableRow 
                    key={p.id}
                    sx={{ 
                      '&:hover': { bgcolor: '#f8f9fa' },
                      '& td': { borderBottom: '1px solid #e0e0e0' }
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip 
                          label={index + 1} 
                          size="small" 
                          color="primary" 
                          variant="filled"
                          sx={{ minWidth: 24, height: 24 }}
                        />
                        <Typography fontWeight="medium">{p.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={p.members_count} 
                        color="info" 
                        variant="outlined"
                        icon={<PeopleIcon />}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <StatusChip status={p.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Projets proches de la deadline */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <ScheduleIcon color="warning" />
            <Typography variant="h6" color="warning.main" fontWeight="bold">
               Projets proches de la date limite
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { bgcolor: '#fff3e0', fontWeight: 'bold' } }}>
                  <TableCell>Projet</TableCell>
                  <TableCell align="center">Date limite</TableCell>
                  <TableCell align="center">Jours restants</TableCell>
                  <TableCell align="center">Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(upcoming_deadlines || []).map((p) => (
                  <TableRow 
                    key={p.id}
                    sx={{ '&:hover': { bgcolor: '#fff8f0' } }}
                  >
                    <TableCell>
                      <Typography fontWeight="medium">{p.title}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {new Date(p.end_date).toLocaleDateString('fr-FR')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={`${p.days_left} jours`}
                        color={p.days_left <= 3 ? 'error' : p.days_left <= 7 ? 'warning' : 'success'}
                        variant="filled"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <StatusChip status={p.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Taux d'avancement par projet */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <AssignmentIcon color="success" />
          <Typography variant="h6" color="success.main" fontWeight="bold">
            Taux d'avancement des projets
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { bgcolor: '#e8f5e8', fontWeight: 'bold' } }}>
                <TableCell>Projet</TableCell>
                <TableCell align="center">Début</TableCell>
                <TableCell align="center">Fin</TableCell>
                <TableCell align="center">Statut</TableCell>
                <TableCell align="center">Avancement</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(project_progress_list || []).map((p) => (
                <TableRow 
                  key={p.id}
                  sx={{ '&:hover': { bgcolor: '#f1f8e9' } }}
                >
                  <TableCell>
                    <Typography fontWeight="medium">{p.title}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {new Date(p.start_date).toLocaleDateString('fr-FR')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {new Date(p.end_date).toLocaleDateString('fr-FR')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <StatusChip status={p.status} />
                  </TableCell>
                  <TableCell align="center">
                    <ProgressBar progress={p.progress} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Graphique en barres d'évolution des projets */}
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: 'primary.main',
            fontWeight: 'bold'
          }}
        >
          Évolution des projets (créés vs terminés)
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#666' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#666' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar 
              dataKey="created" 
              name=" Projets créés"
              fill="#3f51b5"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="completed" 
              name=" Projets terminés"
              fill="#4caf50"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default DgDashboard;