import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";
import { useParams } from "react-router-dom";
import TaskDetailsModal from "./TaskDetailsModal";

function AllTasksKanbanBoard() {
    const { projectId } = useParams();
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const authUser = JSON.parse(localStorage.getItem("user"));
    const [columns, setColumns] = useState({
        todo: { name: "À faire", tasks: [] },
        in_progress: { name: "En cours", tasks: [] },
        in_test: { name: "En test", tasks: [] },
        done: { name: "Terminée", tasks: [] },
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axiosInstance.get(`/projects/${projectId}/tasks/all`)
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
            })
            .catch(err => {
                console.error(err);
                setError("Erreur lors du chargement des tâches");
            })
            .finally(() => setLoading(false));
    }, [projectId]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <>
            <div className="flex gap-4 p-4 overflow-auto">
                {Object.entries(columns).map(([status, column]) => (
                    <div
                        key={status}
                        className="bg-gray-100 rounded-lg p-3 w-64 min-h-[300px]"
                    >
                        <h2 className="font-bold text-center mb-2">{column.name}</h2>
                        {column.tasks.length > 0 ? (
                            column.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="bg-white p-2 mb-2 shadow rounded cursor-pointer"
                                    onClick={() => setSelectedTaskId(task.id)}
                                >
                                    <p className="font-medium">{task.title}</p>
                                    <p className="text-sm text-gray-500">{task.priority}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center">Aucune tâche</p>
                        )}
                    </div>
                ))}
            </div>

            {selectedTaskId && (
                <TaskDetailsModal
                taskId={selectedTaskId}
                userRoleId={authUser.role_id}
                userId={authUser.id}
                onClose={() => setSelectedTaskId(null)}
              />                         
            )}
        </>
    );
}

export default AllTasksKanbanBoard;
