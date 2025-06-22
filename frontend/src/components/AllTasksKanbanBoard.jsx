import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";
import { useParams } from "react-router-dom";
import TaskDetailsModal from "./TaskDetailsModal";

function AllTasksKanbanBoard() {
    const { projectId } = useParams();
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const authUser = JSON.parse(localStorage.getItem("user"));
    const [columns, setColumns] = useState({
        todo: { name: "À faire", tasks: [], color: "bg-slate-50", accent: "border-slate-300" },
        in_progress: { name: "En cours", tasks: [], color: "bg-blue-50", accent: "border-blue-300" },
        in_test: { name: "En test", tasks: [], color: "bg-amber-50", accent: "border-amber-300" },
        done: { name: "Terminée", tasks: [], color: "bg-emerald-50", accent: "border-emerald-300" },
    });
    const [project, setProject] = useState(null);

    const getPriorityConfig = (priority) => {
        switch (priority) {
            case 'urgent': return { color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-100', label: '🔴 Urgent' };
            case 'high': return { color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-100', label: '🟠 Élevée' };
            case 'medium': return { color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-100', label: '🟡 Moyenne' };
            case 'low': return { color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-100', label: '🟢 Faible' };
            default: return { color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-100', label: '⚪ Non définie' };
        }
    };

    useEffect(() => {
        axiosInstance.get(`/projects/${projectId}`).then(res => {
            setProject(res.data.project);
        }).catch(err => {
            console.error("Erreur lors du chargement du projet:", err);
        });
    }, [projectId]);

    useEffect(() => {
        axiosInstance.get(`/projects/${projectId}/tasks/all`)
            .then(res => {
                // L'API retourne directement un tableau de tâches
                const tasks = res.data;
                
                const tasksByStatus = {
                    todo: [],
                    in_progress: [],
                    in_test: [],
                    done: [],
                };
                
                // Parcourir le tableau de tâches et les répartir par statut
                tasks.forEach(task => {
                    if (tasksByStatus[task.status]) {
                        tasksByStatus[task.status].push(task);
                    }
                });
                
                setColumns(prevColumns => ({
                    todo: { ...prevColumns.todo, tasks: tasksByStatus.todo },
                    in_progress: { ...prevColumns.in_progress, tasks: tasksByStatus.in_progress },
                    in_test: { ...prevColumns.in_test, tasks: tasksByStatus.in_test },
                    done: { ...prevColumns.done, tasks: tasksByStatus.done },
                }));
            })
            .catch(err => {
                console.error("Erreur lors du chargement des tâches:", err);
            });
    }, [projectId]);
    
    return (
        <div className="px-4 py-6 mx-auto">
            <div>
                <div className="flex flex-col">
                    <button
                        onClick={() => window.history.go(-1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded !font-bold !text-5xl w-fit"
                    >
                        ←
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Tableau Kanban</h2>
                    {project && (
                        <h2 className="!text-xl font-bold text-gray-800">{project.title}</h2>
                    )}
                </div>
            </div>
            <div className="flex gap-6 overflow-x-auto p-6">
                {Object.entries(columns).map(([status, column]) => (
                    <div key={status} className={`rounded-2xl p-5 w-[300px] shadow-sm border-2 ${column.color} ${column.accent}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-xl text-slate-800">{column.name}</h2>
                            <div className="bg-white/60 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                                {column.tasks.length}
                            </div>
                        </div>
                        <div className="space-y-3 min-h-[400px]">
                            {column.tasks.map(task => {
                                const priority = getPriorityConfig(task.priority);
                                return (
                                    <div
                                        key={task.id}
                                        className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 group cursor-pointer"
                                        onClick={() => setSelectedTaskId(task.id)}
                                    >
                                        <h3 className="font-semibold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                                            {task.title}
                                        </h3>
                                        {task.description && (
                                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${priority.bg} ${priority.text}`}>
                                                {priority.label}
                                            </span>
                                        </div>
                                        
                                        {/* Affichage des employés assignés */}
                                        {task.employees && task.employees.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {task.employees.map(employee => (
                                                    <span key={employee.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                        {employee.first_name} {employee.last_name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        
                                        {/* Affichage de la date d'échéance */}
                                        {task.due_date && (
                                            <div className="text-xs text-gray-500 mt-2">
                                                Échéance: {new Date(task.due_date).toLocaleDateString('fr-FR')}
                                            </div>
                                        )}
                                        
                                        {/* Affichage du nombre de commentaires */}
                                        {task.comments && task.comments.length > 0 && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                💬 {task.comments.length} commentaire{task.comments.length > 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {column.tasks.length === 0 && (
                                <p className="text-sm text-gray-500 text-center">Aucune tâche</p>
                            )}
                        </div>
                    </div>
                ))}

                {selectedTaskId && (
                    <TaskDetailsModal
                        taskId={selectedTaskId}
                        userRoleId={authUser.role_id}
                        userId={authUser.id}
                        onClose={() => setSelectedTaskId(null)}
                    />
                )}
            </div>
        </div>
    );
}

export default AllTasksKanbanBoard;