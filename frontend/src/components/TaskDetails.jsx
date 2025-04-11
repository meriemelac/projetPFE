import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/api";

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, settask] = useState(null);
    const [comments, setComments] = useState([]); // ← ici
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                const response = await axiosInstance.get(`/tasks/${id}`);
                settask(response.data.task);
            } catch (error) {
                setError("Erreur lors de la récupération des détails de la tâche");
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axiosInstance.get(`/tasks/${id}/comments`);
                setComments(response.data.comments);
            } catch (error) {
                console.error("Erreur chargement des commentaires");
            }
        };

        fetchTaskDetails();
        fetchComments();
    }, [id]);

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!task) return <p>Chargement...</p>;

    return (
        <div>
            <h2>Détails de la tâche : {task.title}</h2>
            <p><strong>Description :</strong> {task.description}</p>
            <p><strong>Projet :</strong> {task.project?.title}</p>

            <p><strong>Employés Assignés :</strong></p>
            <ul>
                {task.employees && task.employees.length > 0 ? (
                    task.employees.map((emp) => (
                        <li key={emp.id}>
                            {emp.first_name} {emp.last_name}
                        </li>
                    ))
                ) : (
                    <li>Aucun employé assigné</li>
                )}
            </ul>

            <h3 style={{ marginTop: '30px' }}>Commentaires :</h3>
            <ul>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <li key={comment.id} style={{ marginBottom: '1rem' }}>
                            <strong>{comment.employee?.first_name} {comment.employee?.last_name} :</strong><br />
                            {comment.content}
                        </li>
                    ))
                ) : (
                    <li>Aucun commentaire pour cette tâche.</li>
                )}
            </ul>

            <button onClick={() => navigate("/tasks")} style={{ marginTop: "20px" }}>
                Retour
            </button>
        </div>
    );
};

export default TaskDetails;
