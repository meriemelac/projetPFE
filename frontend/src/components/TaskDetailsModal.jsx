import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";

function TaskDetailsModal({ taskId, onClose }) {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

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
            fetchComments(); // Refresh la liste
        } catch (err) {
            console.error("Erreur d'envoi du commentaire");
        }
    };


    if (!taskId) return null;
    if (loading) return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">Chargement...</div>;
    if (error) return <p>{error}</p>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto shadow-lg relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black">✖</button>
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
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                        Envoyer
                    </button>
                </form>

            </div>
        </div>
    );
}

export default TaskDetailsModal;
