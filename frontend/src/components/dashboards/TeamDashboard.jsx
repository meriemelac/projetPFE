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
  Grid,
} from "@mui/material";
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Task as TaskIcon,
  TrendingUp as TrendingUpIcon,
  PersonPin as PersonPinIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({ title, value, icon, color, bgColor, subtitle }) => (
  <Card 
    sx={{ 
      background: `linear-gradient(135deg, ${bgColor} 0%, ${color} 100%)`,
      color: 'white',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: `0 12px 24px ${color}40`
      }
    }}
    className="shadow-lg rounded-xl"
  >
    <CardContent sx={{ position: 'relative', overflow: 'hidden', p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar 
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.25)', 
            width: 64, 
            height: 64,
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}
        >
          {icon}
        </Avatar>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.1)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -20,
          left: -20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.05)',
        }}
      />
    </CardContent>
  </Card>
);

const StatusChip = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'terminé':
      case 'completed':
      case 'done':
        return { color: 'success', label: 'Terminé' };
      case 'en cours':
      case 'in_progress':
        return { color: 'warning', label: 'En cours' };
      case 'en attente':
      case 'pending':
      case 'todo':
        return { color: 'info', label: 'À faire' };
      case 'annulé':
      case 'cancelled':
        return { color: 'error', label: 'Annulé' };
      default:
        return { color: 'default', label: status || 'N/A' };
    }
  };

  const { color, label } = getStatusConfig(status);
  return (
    <Chip 
      label={label} 
      color={color} 
      variant="filled" 
      size="small"
      sx={{ fontWeight: 'bold' }}
    />
  );
};

const ProgressBar = ({ progress, title }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
      <Typography variant="body2" fontWeight="medium">{title}</Typography>
      <Typography variant="body2" fontWeight="bold" color="primary">
        {progress}%
      </Typography>
    </Box>
    <LinearProgress 
      variant="determinate" 
      value={progress} 
      sx={{
        height: 10,
        borderRadius: 5,
        bgcolor: 'rgba(0,0,0,0.1)',
        '& .MuiLinearProgress-bar': {
          borderRadius: 5,
          background: progress < 30 
            ? 'linear-gradient(90deg, #f44336, #ff5722)' 
            : progress < 70 
            ? 'linear-gradient(90deg, #ff9800, #ffc107)' 
            : 'linear-gradient(90deg, #4caf50, #8bc34a)'
        }
      }}
    />
  </Box>
);

const TeamDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/dashboard/team")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Erreur chargement dashboard équipe", err));
  }, []);

  if (!data) return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="400px"
      flexDirection="column"
      gap={2}
    >
      <Box sx={{ width: 100, height: 100, position: 'relative' }}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '4px solid #e3f2fd',
            borderTop: '4px solid #2196f3',
            animation: 'spin 1s linear infinite',
          }}
        />
      </Box>
      <Typography variant="h6" color="primary" fontWeight="bold">
        🔄 Chargement du tableau de bord...
      </Typography>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );

  const { stats, projects, my_tasks, team_tasks, task_distribution } = data;

  // Préparation des données pour le graphique en secteurs
  const pieData = (task_distribution || []).map((member, index) => ({
    name: `${member.first_name} ${member.last_name}`,
    value: parseInt(member.tasks_count) || 0,
    color: ['#3f51b5', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'][index % 6]
  }));

  // Données pour le graphique en barres des projets
  const barData = (projects || []).map(p => ({
    name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
    progress: p.progress,
    fullName: p.title
  }));

  return (
    <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        sx={{ 
          mb: 4, 
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        Tableau de bord – Chef d'Équipe
      </Typography>

      {/* Statistiques générales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Membres" 
            value={stats.members} 
            icon={<PeopleIcon sx={{ fontSize: 28 }} />}
            color="#1565c0"
            bgColor="#42a5f5"
            subtitle="Équipiers actifs"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Projets" 
            value={stats.projects} 
            icon={<AssignmentIcon sx={{ fontSize: 28 }} />}
            color="#2e7d32"
            bgColor="#66bb6a"
            subtitle="Projets gérés"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Tâches équipe" 
            value={stats.team_tasks} 
            icon={<TaskIcon sx={{ fontSize: 28 }} />}
            color="#ed6c02"
            bgColor="#ffa726"
            subtitle="Activités en cours"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Avancement" 
            value={`${stats.average_progress}%`} 
            icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
            color="#7b1fa2"
            bgColor="#ab47bc"
            subtitle="Progression moyenne"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Mes projets */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <AssignmentIcon color="primary" />
              <Typography variant="h6" color="primary" fontWeight="bold">
                Mes projets
              </Typography>
            </Box>
            
            {/* Graphique en barres pour la progression */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" mb={2}>
                Progression des projets
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value}%`, 
                      'Progression'
                    ]}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.fullName || label;
                    }}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Bar 
                    dataKey="progress" 
                    fill="url(#progressGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3f51b5" />
                      <stop offset="100%" stopColor="#7986cb" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* Tableau des projets */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { bgcolor: '#f5f7fa', fontWeight: 'bold', color: '#1976d2' } }}>
                    <TableCell>Projet</TableCell>
                    <TableCell align="center">Début</TableCell>
                    <TableCell align="center">Fin</TableCell>
                    <TableCell align="center">Statut</TableCell>
                    <TableCell align="center">Avancement</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(projects || []).map((p, index) => (
                    <TableRow 
                      key={p.id}
                      sx={{ 
                        '&:hover': { bgcolor: '#f8f9ff' },
                        '& td': { borderBottom: '1px solid #e3f2fd' }
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: ['#3f51b5', '#4caf50', '#ff9800', '#f44336'][index % 4],
                              fontSize: '14px'
                            }}
                          >
                            {p.title.charAt(0)}
                          </Avatar>
                          <Typography fontWeight="medium">{p.title}</Typography>
                        </Box>
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
                        <Box sx={{ minWidth: 120 }}>
                          <ProgressBar progress={p.progress} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Répartition des tâches */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <PieChartIcon color="secondary" />
              <Typography variant="h6" color="secondary" fontWeight="bold">
                Répartition des tâches
              </Typography>
            </Box>
            
            {/* Graphique en secteurs */}
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} tâches`, name]}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Légende détaillée */}
            <Box sx={{ mt: 2 }}>
              {(task_distribution || []).map((member, index) => (
                <Box 
                  key={member.id} 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="space-between"
                  sx={{ 
                    p: 1.5, 
                    mb: 1, 
                    borderRadius: 2, 
                    bgcolor: '#f8f9fa',
                    '&:hover': { bgcolor: '#e9ecef' }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: ['#3f51b5', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'][index % 6]
                      }}
                    />
                    <Typography variant="body2" fontWeight="medium">
                      {member.first_name} {member.last_name}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${member.tasks_count} tâches`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>


        {/* Tâches de l'équipe */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <GroupIcon color="secondary" />
              <Typography variant="h6" color="secondary" fontWeight="bold">
                Tâches de l'équipe
              </Typography>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { bgcolor: '#f5f7fa', fontWeight: 'bold', color: '#1976d2' } }}>
                    <TableCell>Tâche</TableCell>
                    <TableCell>Projet</TableCell>
                    
                    <TableCell align="center">Échéance</TableCell>
                    <TableCell align="center">Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(team_tasks || []).map((t, index) => (
                    <TableRow 
                      key={t.id}
                      sx={{ 
                        '&:hover': { bgcolor: '#f8f9ff' },
                        '& td': { borderBottom: '1px solid #e3f2fd' }
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar 
                            sx={{ 
                              width: 24, 
                              height: 24, 
                              bgcolor: ['#3f51b5', '#4caf50', '#ff9800', '#f44336'][index % 4],
                              fontSize: '12px'
                            }}
                          >
                            {t.title.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight="medium">{t.title}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {t.project?.title || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {t.due_date ? new Date(t.due_date).toLocaleDateString('fr-FR') : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <StatusChip status={t.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeamDashboard;