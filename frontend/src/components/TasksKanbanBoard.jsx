import React, { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axiosInstance from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import AddTaskModal from "./AddTaskModal";
import TaskDetailsModal from "./TaskDetailsModal";
import { useNavigate } from "react-router-dom";

function TasksKanbanBoard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [project, setProject] = useState(null);



    const roleId = user?.role_id;
    const canManage = ["1", "2", "3"].includes(roleId);

    const [columns, setColumns] = useState({
        todo: { name: "À faire", tasks: [], color: "bg-slate-50", accent: "border-slate-300" },
        in_progress: { name: "En cours", tasks: [], color: "bg-blue-50", accent: "border-blue-300" },
        in_test: { name: "En test", tasks: [], color: "bg-amber-50", accent: "border-amber-300" },
        done: { name: "Terminée", tasks: [], color: "bg-emerald-50", accent: "border-emerald-300" },
    });

    useEffect(() => {
        axiosInstance.get(`/projects/${projectId}/my-tasks`)
            .then(res => {
                const tasksByStatus = {
                    todo: [],
                    in_progress: [],
                    in_test: [],
                    done: [],
                };
                res.data.forEach(task => {
                    tasksByStatus[task.status].push(task);
                });
                setColumns(prevColumns => ({
                    todo: { ...prevColumns.todo, tasks: tasksByStatus.todo },
                    in_progress: { ...prevColumns.in_progress, tasks: tasksByStatus.in_progress },
                    in_test: { ...prevColumns.in_test, tasks: tasksByStatus.in_test },
                    done: { ...prevColumns.done, tasks: tasksByStatus.done },
                }));
            });
    }, [projectId]);


    useEffect(() => {
        axiosInstance.get(`/projects/${projectId}`).then(res => {
            setProject(res.data.project);
        });

    });

    const onDragEnd = async ({ source, destination }) => {
        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const sourceCol = columns[source.droppableId];
        const destCol = columns[destination.droppableId];
        const movedTask = { ...sourceCol.tasks[source.index] };

        if (source.droppableId === destination.droppableId) {
            const updatedTasks = Array.from(sourceCol.tasks);
            updatedTasks.splice(source.index, 1);
            updatedTasks.splice(destination.index, 0, movedTask);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceCol,
                    tasks: updatedTasks,
                },
            });
        } else {
            const newSourceTasks = Array.from(sourceCol.tasks);
            const newDestTasks = Array.from(destCol.tasks);

            newSourceTasks.splice(source.index, 1);
            newDestTasks.splice(destination.index, 0, movedTask);

            setColumns({
                ...columns,
                [source.droppableId]: { ...sourceCol, tasks: newSourceTasks },
                [destination.droppableId]: { ...destCol, tasks: newDestTasks },
            });
        }

        await axiosInstance.put(`/tasks/${movedTask.id}/my-status`, {
            status: destination.droppableId,
            position: destination.index,
        });
    };

    const getPriorityConfig = (priority) => {
        switch (priority) {
            case 'urgent':
                return { color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-100', label: '🔴 Urgent' };
            case 'high':
                return { color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-100', label: '🟠 Élevée' };
            case 'medium':
                return { color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-100', label: '🟡 Moyenne' };
            case 'low':
                return { color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-100', label: '🟢 Faible' };
            default:
                return { color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-100', label: '⚪ Non définie' };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { text: `Retard de ${Math.abs(diffDays)} jour(s)`, color: 'text-red-600', bg: 'bg-red-100' };
        } else if (diffDays === 0) {
            return { text: "Aujourd'hui", color: 'text-orange-600', bg: 'bg-orange-100' };
        } else if (diffDays <= 3) {
            return { text: `Dans ${diffDays} jour(s)`, color: 'text-amber-600', bg: 'bg-amber-100' };
        } else {
            return { text: date.toLocaleDateString('fr-FR'), color: 'text-slate-600', bg: 'bg-slate-100' };
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'todo': return '';
            case 'in_progress': return '';
            case 'in_test': return '';
            case 'done': return '';
            default: return '';
        }
    };

    return (
        <div className="px-4 py-6  mx-auto">
            {/* Header avec actions */}
            <div className="mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

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

                    {canManage && (
                        <div className="self-end md:self-auto !space-x-3">
                            <button
                                onClick={() => navigate(`/projects/${projectId}/tasks/all`)}
                                className="text-white !text-sm px-4 py-2 rounded"
                                style={{ backgroundColor: "#0077B6" }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}
                            >
                                Voir toutes les tâches
                            </button>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="text-white !text-sm px-4 py-2 rounded"
                                style={{ backgroundColor: "#0077B6" }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}
                            >
                                + Ajouter une tâche
                            </button>

                        </div>
                    )}
                </div>
            </div>

            <AddTaskModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onTaskCreated={() => {
                    window.location.reload();
                }}
            />

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-6">
                    {Object.entries(columns).map(([status, column]) => (
                        <Droppable droppableId={status} key={status}>
                            {(provided, snapshot) => (
                                <div
                                    className={`
                                        ${column.color} rounded-2xl p-5 w-[300px] shadow-sm border-2 transition-all duration-200
                                        ${snapshot.isDraggingOver ? `${column.accent} shadow-lg` : 'border-transparent'}
                                    `}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {/* En-tête de colonne */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{getStatusIcon(status)}</span>
                                            <h2 className="font-bold text-xl text-slate-800">{column.name}</h2>
                                        </div>
                                        <div className="bg-white/60 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                                            {column.tasks.length}
                                        </div>
                                    </div>

                                    {/* Liste des tâches */}
                                    <div className="space-y-3 min-h-[400px]">
                                        {column.tasks.map((task, index) => {
                                            const priorityConfig = getPriorityConfig(task.priority);
                                            const dueDateInfo = formatDate(task.due_date);

                                            return (
                                                <Draggable draggableId={`${task.id}`} index={index} key={task.id}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className={`
                                                                bg-white rounded-xl p-4 shadow-sm border border-slate-200 cursor-pointer
                                                                hover:shadow-md transition-all duration-200 group
                                                                ${snapshot.isDragging ? 'shadow-xl rotate-3 scale-105' : ''}
                                                            `}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => setSelectedTaskId(task.id)}
                                                        >
                                                            {/* Titre de la tâche */}
                                                            <h3 className="font-semibold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                                                                {task.title}
                                                            </h3>

                                                            {/* Description (si disponible) */}
                                                            {task.description && (
                                                                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                                                    {task.description}
                                                                </p>
                                                            )}

                                                            {/* Métadonnées */}
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                {/* Priorité */}
                                                                <span className={`
                                                                    px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                                                                    ${priorityConfig.bg} ${priorityConfig.text}
                                                                `}>

                                                                    {priorityConfig.label}
                                                                </span>

                                                                {/* Date d'échéance */}
                                                                {dueDateInfo && (
                                                                    <span className={`
                                                                        px-4 py-1 rounded-full text-xs font-medium
                                                                        ${dueDateInfo.bg} ${dueDateInfo.color}
                                                                    `}>
                                                                        {dueDateInfo.text}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Assignés */}
                                                            {task.employees && task.employees.length > 0 && (
                                                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                                                    <span className="text-xs text-slate-500">Assigné à:</span>
                                                                    <div className="flex -space-x-2">
                                                                        {task.employees.slice(0, 3).map((employee, idx) => (
                                                                            <div
                                                                                key={employee.id}
                                                                                className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm"
                                                                                title={`${employee.first_name} ${employee.last_name}`}
                                                                            >
                                                                                {employee.first_name[0]}{employee.last_name[0]}
                                                                            </div>
                                                                        ))}
                                                                        {task.employees.length > 3 && (
                                                                            <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm">
                                                                                +{task.employees.length - 3}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Indicateur de drag */}
                                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 transition-opacity">
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                                                                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                                                                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                                                                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}

                                        {/* Message si aucune tâche */}
                                        {column.tasks.length === 0 && (
                                            <div className="text-center py-12 text-slate-400">
                                                <div className="text-4xl mb-2"></div>
                                                <p className="text-sm">Aucune tâche dans cette colonne</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            {selectedTaskId && (
                <TaskDetailsModal
                    taskId={selectedTaskId}
                    onClose={() => setSelectedTaskId(null)}
                />
            )}
        </div>
    );
}

export default TasksKanbanBoard;