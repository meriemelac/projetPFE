import React, { useEffect, useState } from "react";
import axiosInstance from "../api/api";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
    const [tasks, settasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchtasks = async () => {
            try {
                const response = await axiosInstance.get("/tasks");
                settasks(response.data.tasks);
            } catch (error) {
                setError("Erreur lors de la récupération des taches");
            } finally {
                setLoading(false);
            }
        };

        fetchtasks();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Liste des taches</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id} style={{ marginBottom: "1rem" }}>
                        <p><strong>{task.title}</strong></p>
                        <button onClick={() => navigate(`/tasks/${task.id}`)}>
                            Voir les détails
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tasks;
