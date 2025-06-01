import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axiosInstance from "../api/api";
import { useParams } from "react-router-dom";
import AddTaskModal from "./AddTaskModal";
import TaskDetailsModal from "./TaskDetailsModal";
import { FaPlus, FaClock, FaExclamationTriangle } from "react-icons/fa";

function TasksKanbanBoard() {
    const { projectId } = useParams();
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [columns, setColumns] = useState({
        todo: { name: "À faire", tasks: [], color: "bg-gray-100" },
        in_progress: { name: "En cours", tasks: [], color: "bg-blue-100" },
        in_test: { name: "En test", tasks: [], color: "bg-yellow-100" },
        done: { name: "Terminée", tasks: [], color: "bg-green-100" },
    });

    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get(`/projects/${projectId}/my-tasks`);
            const tasksByStatus = {
                todo: [],
                in_progress: [],
                in_test: [],
                done: [],
            };
            response.data.forEach(task => {
                tasksByStatus[task.status].push(task);
            });
            setColumns(prev => ({
                todo: { ...prev.todo, tasks: tasksByStatus.todo },
                in_progress: { ...prev.in_progress, tasks: tasksByStatus.in_progress },
                in_test: { ...prev.in_test, tasks: tasksByStatus.in_test },
                done: { ...prev.done, tasks: tasksByStatus.done },
            }));
        } catch (error) {
            setError("Erreur lors du chargement des tâches");
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

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

        try {
            await axiosInstance.put(`/tasks/${movedTask.id}/my-status`, {
                status: destination.droppableId,
                position: destination.index,
            });

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
        } catch (error) {
            console.error("Error updating task status:", error);
            // Revert the UI state if the API call fails
            fetchTasks();
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-red-500';
            case 'high': return 'bg-orange-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4">
                <FaExclamationTriangle className="text-red-500 text-4xl mb-2 mx-auto" />
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <button 
                onClick={() => setShowAddModal(true)} 
                className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center"
            >
                <FaPlus className="mr-2" />
                Ajouter une tâche
            </button>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {Object.entries(columns).map(([status, column]) => (
                        <Droppable droppableId={status} key={status}>
                            {(provided) => (
                                <div
                                    className={`${column.color} rounded-lg p-4 w-80 min-h-[500px] shadow-lg`}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <h2 className="font-bold text-lg mb-4 text-center">{column.name}</h2>
                                    
                                    <div className="space-y-3">
                                        {column.tasks.map((task, index) => (
                                            <Draggable 
                                                draggableId={`${task.id}`} 
                                                index={index} 
                                                key={task.id}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-white p-4 rounded-lg shadow ${
                                                            snapshot.isDragging ? 'shadow-lg' : ''
                                                        }`}
                                                        onClick={() => setSelectedTaskId(task.id)}
                                                    >
                                                        <h3 className="font-semibold mb-2">{task.title}</h3>
                                                        
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className={`${getPriorityColor(task.priority)} text-white px-2 py-1 rounded-full text-xs`}>
                                                                {task.priority}
                                                            </span>
                                                            
                                                            {task.due_date && (
                                                                <div className="flex items-center text-gray-500">
                                                                    <FaClock className="mr-1" size={12} />
                                                                    <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <AddTaskModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onTaskCreated={fetchTasks}
            />

            {selectedTaskId && (
                <TaskDetailsModal
                    taskId={selectedTaskId}
                    onClose={() => setSelectedTaskId(null)}
                    onTaskUpdated={fetchTasks}
                />
            )}
        </div>
    );
}

export default TasksKanbanBoard;