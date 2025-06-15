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
  Badge,
  Divider,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Task as TaskIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Folder as FolderIcon,
  ListAlt as ListAltIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
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
  RadialBarChart,
  RadialBar,
} from "recharts";

const StatCard = ({ title, value, icon, color, bgColor, subtitle, trend }) => (
  <Card 
    sx={{ 
      background: `linear-gradient(135deg, ${bgColor} 0%, ${color} 100%)`,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      '&:hover': {
        transform: 'translateY(-12px) scale(1.05)',
        boxShadow: `0 20px 40px ${color}50`
      }
    }}
  >
    <CardContent sx={{ p: 3, position: 'relative', zIndex: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Badge 
          badgeContent={trend} 
          color="secondary"
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: 'rgba(255,255,255,0.9)',
              color: color,
              fontWeight: 'bold'
            }
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.3)', 
              width: 70, 
              height: 70,
              backdropFilter: 'blur(15px)',
              border: '3px solid rgba(255,255,255,0.4)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            {icon}
          </Avatar>
        </Badge>
      </Box>
    </CardContent>
    
    {/* Effets décoratifs */}
    <Box
      sx={{
        position: 'absolute',
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: '50%',
        bgcolor: 'rgba(255,255,255,0.1)',
        zIndex: 1
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 80,
        height: 80,
        borderRadius: '50%',
        bgcolor: 'rgba(255,255,255,0.05)',
        zIndex: 1
      }}
    />
  </Card>
);

const StatusChip = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'terminé':
      case 'completed':
        return { color: 'success', bg: '#e8f5e9' };
      case 'en cours':
      case 'in_progress':
        return { color: 'warning', bg: '#fff3e0' };
      case 'en attente':
      case 'pending':
        return { color: 'info', bg: '#e3f2fd' };
      case 'annulé':
      case 'cancelled':
        return { color: 'error', bg: '#ffebee' };
      default:
        return { color: 'default', bg: '#f5f5f5' };
    }
  };

  const { color, icon, bg } = getStatusConfig(status);
  return (
    <Chip 
      label={`${icon} ${status}`} 
      color={color} 
      variant="filled" 
      size="small"
      sx={{ 
        fontWeight: 'bold',
        '&:hover': { 
          transform: 'scale(1.05)',
          boxShadow: 2
        }
      }}
    />
  );
};

const PriorityChip = ({ dueDate }) => {
  const daysDiff = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff < 0) {
    return <Chip label="En retard" color="error" variant="filled" size="small" />;
  } else if (daysDiff <= 2) {
    return <Chip label="Urgent" color="error" variant="outlined" size="small" />;
  } else if (daysDiff <= 7) {
    return <Chip label="Bientôt" color="warning" variant="outlined" size="small" />;
  } else {
    return <Chip label="Normal" color="success" variant="outlined" size="small" />;
  }
};

const ProgressCircle = ({ progress, size = 60 }) => (
  <Box position="relative" display="inline-flex">
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `conic-gradient(
          ${progress < 30 ? '#f44336' : progress < 70 ? '#ff9800' : '#4caf50'} ${progress * 3.6}deg,
          #e0e0e0 ${progress * 3.6}deg
        )`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          width: size - 8,
          height: size - 8,
          borderRadius: '50%',
          bgcolor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="caption" fontWeight="bold" color="primary">
          {progress}%
        </Typography>
      </Box>
    </Box>
  </Box>
);

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/dashboard/employee")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Erreur chargement dashboard employé", err));
  }, []);

  if (!data) return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh"
      flexDirection="column"
      gap={3}
      sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: '6px solid rgba(255,255,255,0.3)',
            borderTop: '6px solid white',
            animation: 'spin 1s linear infinite',
          }}
        />
        <PersonIcon 
          sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 40,
            color: 'white'
          }} 
        />
      </Box>
      <Typography variant="h5" color="white" fontWeight="bold">
        Chargement de votre espace de travail...
      </Typography>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );

  const { stats, projects, my_tasks } = data;

  // Données pour les graphiques
  const taskStatusData = [
    { name: 'Terminées', value: stats.completed_tasks, color: '#4caf50' },
    { name: 'En cours', value: stats.tasks - stats.completed_tasks, color: '#ff9800' }
  ];

  const projectProgressData = projects.map(p => ({
    name: p.title.length > 12 ? p.title.substring(0, 12) + '...' : p.title,
    progress: p.progress,
    fullName: p.title
  }));

  return (
    <Box sx={{ p: 3, bgcolor: '#fafbfc', minHeight: '100vh' }}>
      <Box 
        display="flex" 
        alignItems="center" 
        gap={2} 
        mb={4}
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 4,
          color: 'white'
        }}
      >
        <Avatar 
          sx={{ 
            width: 64, 
            height: 64, 
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <PersonIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Bonjour ! Votre tableau de bord personnel
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Suivez vos projets et tâches en temps réel
          </Typography>
        </Box>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="Projets actifs" 
            value={stats.projects} 
            icon={<AssignmentIcon sx={{ fontSize: 32 }} />}
            color="#1565c0"
            bgColor="#42a5f5"
            subtitle="Projets en cours"
           
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="📝 Tâches totales" 
            value={stats.tasks} 
            icon={<TaskIcon sx={{ fontSize: 32 }} />}
            color="#2e7d32"
            bgColor="#66bb6a"
            subtitle="À faire & terminées"
            
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="✅ Tâches terminées" 
            value={stats.completed_tasks} 
            icon={<CheckCircleIcon sx={{ fontSize: 32 }} />}
            color="#ed6c02"
            bgColor="#ffa726"
            subtitle="Objectifs atteints"
           
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard 
            title="📊 Progression moyenne" 
            value={`${stats.average_progress}%`} 
            icon={<TrendingUpIcon sx={{ fontSize: 32 }} />}
            color="#7b1fa2"
            bgColor="#ab47bc"
            subtitle="Performance globale"
          
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Section des projets */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <FolderIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h6" color="primary" fontWeight="bold">
                Mes projets en cours
              </Typography>
            </Box>

            {/* Graphique de progression */}
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9ff', borderRadius: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" mb={2}>
                Progression par projet
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={projectProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3f2fd" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Progression']}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.fullName || label;
                    }}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="progress" 
                    fill="url(#projectGradient)"
                    radius={[6, 6, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="projectGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
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
                    <TableCell align="center">Progression</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((p, index) => (
                    <TableRow 
                      key={p.id}
                      sx={{ 
                        '&:hover': { bgcolor: '#f8f9ff', transform: 'scale(1.01)' },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar 
                            sx={{ 
                              width: 36, 
                              height: 36, 
                              bgcolor: ['#3f51b5', '#4caf50', '#ff9800', '#f44336', '#9c27b0'][index % 5],
                              fontSize: '16px',
                              fontWeight: 'bold'
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
                        <ProgressCircle progress={p.progress} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Section des tâches et statistiques */}
        <Grid item xs={12} lg={4}>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Graphique des tâches */}
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 4 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CheckCircleIcon color="success" />
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  Répartition des tâches
                </Typography>
              </Box>
              
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} tâches`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>

              <Box display="flex" justifyContent="center" gap={2} mt={2}>
                {taskStatusData.map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: item.color 
                      }} 
                    />
                    <Typography variant="caption" fontWeight="bold">
                      {item.name}: {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Liste des tâches récentes */}
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 4 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <ListAltIcon color="warning" />
                <Typography variant="h6" color="warning.main" fontWeight="bold">
                  Mes tâches urgentes
                </Typography>
              </Box>

              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {my_tasks.slice(0, 5).map((task, index) => (
                  <Box 
                    key={task.id} 
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      borderRadius: 3, 
                      bgcolor: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      '&:hover': { 
                        bgcolor: '#e9ecef', 
                        transform: 'translateX(4px)',
                        boxShadow: 2
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Avatar 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          bgcolor: ['#3f51b5', '#4caf50', '#ff9800', '#f44336'][index % 4],
                          fontSize: '12px'
                        }}
                      >
                        {task.title.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="bold" flex={1}>
                        {task.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      {task.project?.title}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" gap={1}>
                        <StatusChip status={task.status} />
                        <PriorityChip dueDate={task.due_date} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(task.due_date).toLocaleDateString('fr-FR')}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;