import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";

function TaskDetailsModal({ taskId, onClose, userRoleId, userId }) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    const fetchComments = async () => {
        try {
            const res = await axiosInstance.get(`/tasks/${taskId}/comments`);
            setComments(res.data);
        } catch (err) {
            console.error("Erreur de chargement des commentaires");
        }
    };

    useEffect(() => {
        fetchComments();
    }, [taskId]);

    useEffect(() => {
        if (!taskId) return;
        setLoading(true);

        axiosInstance.get(`/tasks/${taskId}`)
            .then(res => {
                setTask(res.data.task);
                setEditData({
                    title: res.data.task.title,
                    description: res.data.task.description,
                    priority: res.data.task.priority,
                    due_date: res.data.task.due_date,
                    status: res.data.task.status
                });
            })
            .catch(() => setError("Erreur de chargement de la tâche"))
            .finally(() => setLoading(false));
    }, [taskId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await axiosInstance.post(`/tasks/${taskId}/comments`, { content: newComment });
            setNewComment("");
            fetchComments();
        } catch (err) {
            console.error("Erreur d'envoi du commentaire");
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/tasks/${taskId}`, editData);
            setIsEditing(false);
            // recharger la tâche après modification
            const res = await axiosInstance.get(`/tasks/${taskId}`);
            setTask(res.data.task);
        } catch (err) {
            console.error("Erreur de modification de la tâche", err);
            setError(err.response?.data?.message || "Erreur lors de la modification");
        }
    };

    const canEdit = userRoleId === "1" || userRoleId === "2" || userRoleId === "3"; // admin / chef dep / chef équipe
    const canEditStatus = task?.employees?.some(emp => emp.id === userId); // employé assigné

    if (!taskId) return null;
    if (loading) return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">Chargement...</div>;
    if (error) return <p>{error}</p>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto shadow-lg relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black">✖</button>

                {isEditing ? (
                    <>
                        <h2 className="text-xl font-bold mb-4">Modifier la tâche</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-3">
                            <input
                                type="text"
                                value={editData.title}
                                onChange={e => setEditData({ ...editData, title: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                                required
                            />
                            <textarea
                                value={editData.description}
                                onChange={e => setEditData({ ...editData, description: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                            />
                            <select
                                value={editData.priority}
                                onChange={e => setEditData({ ...editData, priority: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="low">Faible</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                                <option value="urgent">Urgente</option>
                            </select>
                            <input
                                type="date"
                                value={editData.due_date || ""}
                                onChange={e => setEditData({ ...editData, due_date: e.target.value })}
                                className="w-full border px-3 py-2 rounded"
                            />
                            {canEditStatus && (
                                <select
                                    value={editData.status}
                                    onChange={e => setEditData({ ...editData, status: e.target.value })}
                                    className="w-full border px-3 py-2 rounded"
                                >
                                    <option value="todo">À faire</option>
                                    <option value="in_progress">En cours</option>
                                    <option value="in_test">En test</option>
                                    <option value="done">Terminée</option>
                                </select>
                            )}
                            <div className="flex gap-2">
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Enregistrer</button>
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-400 text-black rounded">Annuler</button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold mb-4">{task.title}</h2>
                        <p className="mb-2"><strong>Description :</strong> {task.description || "Aucune"}</p>
                        <p className="mb-2"><strong>Statut :</strong> {task.status}</p>
                        <p className="mb-2"><strong>Priorité :</strong> {task.priority}</p>
                        <p className="mb-2"><strong>Échéance :</strong> {task.due_date || "Non définie"}</p>

                        <hr className="my-3" />

                        <p className="mb-2"><strong>Projet :</strong> {task.project?.title}</p>
                        <p className="mb-2"><strong>Créée par :</strong> {task.creator?.first_name} {task.creator?.last_name}</p>

                        <p className="mb-2"><strong>Assignés :</strong></p>
                        <ul className="list-disc pl-6 text-sm">
                            {task.employees?.length > 0 ? (
                                task.employees.map(emp => (
                                    <li key={emp.id}>{emp.first_name} {emp.last_name}</li>
                                ))
                            ) : (
                                <li>Aucun employé assigné</li>
                            )}
                        </ul>

                        {canEdit && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded"
                                >
                                    Modifier la tâche
                                </button>
                                <button
                                    onClick={async () => {
                                        if (window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
                                            try {
                                                await axiosInstance.delete(`/tasks/${taskId}`);
                                                alert("Tâche supprimée !");
                                                onClose(); // ferme le modal
                                                window.location.reload(); // recharge la page
                                            } catch (err) {
                                                console.error("Erreur de suppression", err);
                                                alert(err.response?.data?.message || "Erreur lors de la suppression");
                                            }
                                        }
                                    }}
                                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
                                >
                                    Supprimer la tâche
                                </button>


                            </>
                        )}


                        <hr className="my-4" />
                        <h3 className="font-semibold text-lg mb-2">Commentaires</h3>

                        <div className="space-y-3 max-h-[200px] overflow-y-auto mb-3">
                            {comments.map(comment => (
                                <div key={comment.id} className="border rounded p-2 bg-gray-50">
                                    <p className="text-sm text-gray-700">{comment.content}</p>
                                    <p className="text-xs text-gray-500 mt-1">— {comment.employee?.first_name} {comment.employee?.last_name}</p>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleCommentSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Écrire un commentaire..."
                                className="flex-1 border px-3 py-2 rounded"
                            />
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-black rounded">
                                Envoyer
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default TaskDetailsModal;
