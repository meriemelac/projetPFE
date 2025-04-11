import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/api";

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, settask] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchtaskDetails = async () => {
            try {
                const response = await axiosInstance.get(`/tasks/${id}`);
                settask(response.data.task); // correction ici
            } catch (error) {
                setError("Erreur lors de la récupération des détails de la tache");
            }
        };
    
        fetchtaskDetails();
    }, [id]);
    

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!task) return <p>Chargement...</p>;

    return (
        <div>
            <h2>Détails de la tache : {task.title}</h2>
            <p><strong>Description :</strong> {task.description}</p>
            <p><strong>Project :</strong> {task.project?.title}</p>
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


            <button onClick={() => navigate("/tasks")} style={{ marginTop: "20px" }}>
                Retour
            </button>
        </div>
    );
};

export default TaskDetails;
