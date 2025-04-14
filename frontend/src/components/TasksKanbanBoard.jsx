import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axiosInstance from "../api/api";
import { useParams } from "react-router-dom";
import AddTaskModal from "./AddTaskModal";


function TasksKanbanBoard() {
    const { projectId } = useParams();
    const [showAddModal, setShowAddModal] = useState(false);

    const [columns, setColumns] = useState({
        todo: { name: "À faire", tasks: [] },
        in_progress: { name: "En cours", tasks: [] },
        in_test: { name: "En test", tasks: [] },
        done: { name: "Terminée", tasks: [] },
    });

    useEffect(() => {
        axiosInstance.get(`/projects/${projectId}/tasks`)
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
                setColumns({
                    todo: { name: "À faire", tasks: tasksByStatus.todo },
                    in_progress: { name: "En cours", tasks: tasksByStatus.in_progress },
                    in_test: { name: "En test", tasks: tasksByStatus.in_test },
                    done: { name: "Terminée", tasks: tasksByStatus.done },
                });
            });
    }, [projectId]);


    // 🔁 Drag and Drop
    const onDragEnd = async ({ source, destination }) => {
        if (!destination) return;

        // ✅ Rien n'a changé
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const sourceCol = columns[source.droppableId];
        const destCol = columns[destination.droppableId];
        const movedTask = { ...sourceCol.tasks[source.index] }; // copie de la tâche

        if (source.droppableId === destination.droppableId) {
            // 🟡 Même colonne → réorganiser les tâches
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
            // 🟢 Colonne différente → déplacer la tâche entre colonnes
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

        // 🔁 Mise à jour backend
        await axiosInstance.put(`/tasks/${movedTask.id}/status`, {
            status: destination.droppableId,
            position: destination.index,
        });
    };



    return (
        <>
            <button onClick={() => setShowAddModal(true)} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">
                + Ajouter une tâche
            </button>
            <AddTaskModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onTaskCreated={() => {
                    // Refresh tâches ici (ex: reload depuis API)
                    window.location.reload(); // rapide mais brut ; sinon appelle useEffect ou refetch
                }}
            />

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 p-4 overflow-auto">
                    {Object.entries(columns).map(([status, column]) => (
                        <Droppable droppableId={status} key={status}>
                            {(provided) => (
                                <div
                                    className="bg-gray-100 rounded-lg p-3 w-64 min-h-[300px]"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <h2 className="font-bold text-center mb-2">{column.name}</h2>
                                    {column.tasks.map((task, index) => (
                                        <Draggable draggableId={`${task.id}`} index={index} key={task.id}>
                                            {(provided) => (
                                                <div
                                                    className="bg-white p-2 mb-2 shadow rounded cursor-pointer"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <p className="font-medium">{task.title}</p>
                                                    <p className="text-sm text-gray-500">{task.priority}</p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </>
    );
}

export default TasksKanbanBoard;
