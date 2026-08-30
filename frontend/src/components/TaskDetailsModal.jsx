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
            const res = await axiosInstance.get(`/tasks/${taskId}`);
            setTask(res.data.task);
        } catch (err) {
            console.error("Erreur de modification de la tâche", err);
            setError(err.response?.data?.message || "Erreur lors de la modification");
        }
    };

    const canEdit = userRoleId === "1" || userRoleId === "2" || userRoleId === "3";
    const canEditStatus = task?.employees?.some(emp => emp.id === userId);

    const getPriorityConfig = (priority) => {
        switch (priority) {
            case 'urgent': 
                return { color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-100', label: '🔴 Urgent', border: 'border-red-200' };
            case 'high': 
                return { color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-100', label: '🟠 Élevée', border: 'border-orange-200' };
            case 'medium': 
                return { color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-100', label: '🟡 Moyenne', border: 'border-yellow-200' };
            case 'low': 
                return { color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-100', label: '🟢 Faible', border: 'border-green-200' };
            default: 
                return { color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-100', label: '⚪ Non définie', border: 'border-gray-200' };
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'todo': return { bg: 'bg-slate-100', text: 'text-slate-700', label: 'À faire', border: 'border-slate-200' };
            case 'in_progress': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'En cours', border: 'border-blue-200' };
            case 'in_test': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'En test', border: 'border-amber-200' };
            case 'done': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Terminée', border: 'border-emerald-200' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status, border: 'border-gray-200' };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return { text: `Retard de ${Math.abs(diffDays)} jour(s)`, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
        } else if (diffDays === 0) {
            return { text: "Aujourd'hui", color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' };
        } else if (diffDays <= 3) {
            return { text: `Dans ${diffDays} jour(s)`, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' };
        } else {
            return { text: date.toLocaleDateString('fr-FR'), color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' };
        }
    };

    if (!taskId) return null;
    
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="text-slate-700 font-medium">Chargement...</span>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md">
                    <div className="text-center">
                        <div className="text-red-500 text-4xl mb-4"></div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Erreur</h3>
                        <p className="text-slate-600 mb-4">{error}</p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const priorityConfig = getPriorityConfig(task.priority);
    const statusConfig = getStatusConfig(task.status);
    const dueDateInfo = formatDate(task.due_date);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[500px] overflow-hidden shadow-2xl border border-slate-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 !p-6 relative">
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all duration-200 shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    {!isEditing && (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3 pr-12">{task.title}</h2>
                            <div className="flex flex-wrap gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                                    {statusConfig.label}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}>
                                    {priorityConfig.label}
                                </span>
                                {dueDateInfo && (
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${dueDateInfo.bg} ${dueDateInfo.color} ${dueDateInfo.border}`}>
                                         {dueDateInfo.text}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {isEditing && (
                        <h2 className="text-2xl font-bold text-slate-800">Modifier la tâche</h2>
                    )}
                </div>

                {/* Content */}
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
                    {isEditing ? (
                        <div className="p-6">
                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Titre *</label>
                                    <input
                                        type="text"
                                        value={editData.title}
                                        onChange={e => setEditData({ ...editData, title: e.target.value })}
                                        className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        required
                                        placeholder="Entrez le titre de la tâche"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                    <textarea
                                        value={editData.description}
                                        onChange={e => setEditData({ ...editData, description: e.target.value })}
                                        className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
                                        placeholder="Décrivez la tâche en détail"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Priorité</label>
                                        <select
                                            value={editData.priority}
                                            onChange={e => setEditData({ ...editData, priority: e.target.value })}
                                            className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        >
                                            <option value="low">🟢 Faible</option>
                                            <option value="medium">🟡 Moyenne</option>
                                            <option value="high">🟠 Élevée</option>
                                            <option value="urgent">🔴 Urgente</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Date d'échéance</label>
                                        <input
                                            type="date"
                                            value={editData.due_date || ""}
                                            onChange={e => setEditData({ ...editData, due_date: e.target.value })}
                                            className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                
                                {canEditStatus && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Statut</label>
                                        <select
                                            value={editData.status}
                                            onChange={e => setEditData({ ...editData, status: e.target.value })}
                                            className="w-full border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        >
                                            <option value="todo">À faire</option>
                                            <option value="in_progress">En cours</option>
                                            <option value="in_test">En test</option>
                                            <option value="done">Terminée</option>
                                        </select>
                                    </div>
                                )}
                                
                                <div className="flex gap-3 pt-4">
                                    <button 
                                        type="submit" 
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        Enregistrer
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditing(false)} 
                                        className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-medium transition-all duration-200"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="p-6 space-y-6">
                            {/* Description */}
                            {task.description && (
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
                                    <p className="text-slate-700 leading-relaxed">{task.description}</p>
                                </div>
                            )}

                            {/* Informations du projet */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <h3 className="font-semibold text-blue-800 mb-3">Informations du projet</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-blue-600 font-medium">Projet</p>
                                        <p className="text-blue-800 font-semibold">{task.project?.title}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-600 font-medium">Créée par</p>
                                        <p className="text-blue-800 font-semibold">{task.creator?.first_name} {task.creator?.last_name}</p>
                                        <p className="text-xs text-blue-600">{task.creator?.position}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Employés assignés */}
                            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                <h3 className="font-semibold text-purple-800 mb-3">👥 Employés assignés</h3>
                                {task.employees?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {task.employees.map(emp => (
                                            <div key={emp.id} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-purple-100">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-medium shadow-sm">
                                                    {emp.first_name[0]}{emp.last_name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-purple-800">{emp.first_name} {emp.last_name}</p>
                                                    <p className="text-sm text-purple-600">{emp.position}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-purple-600 italic">Aucun employé assigné</p>
                                )}
                            </div>

                            {/* Actions */}
                            {canEdit && (
                                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="!px-6 !py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                                    >
                                        Modifier la tâche
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
                                                try {
                                                    await axiosInstance.delete(`/tasks/${taskId}`);
                                                    alert("Tâche supprimée !");
                                                    onClose();
                                                    window.location.reload();
                                                } catch (err) {
                                                    console.error("Erreur de suppression", err);
                                                    alert(err.response?.data?.message || "Erreur lors de la suppression");
                                                }
                                            }
                                        }}
                                        className="!px-6 !py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-black rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            )}

                            {/* Section commentaires */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    Commentaires
                                    <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded-full text-xs">
                                        {comments.length}
                                    </span>
                                </h3>

                                {/* Liste des commentaires */}
                                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                                    {comments.length > 0 ? (
                                        comments.map(comment => (
                                            <div key={comment.id} className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                                                        {comment.employee?.first_name?.[0]}{comment.employee?.last_name?.[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-slate-700 mb-2">{comment.content}</p>
                                                        <p className="text-xs text-slate-500 font-medium">
                                                            {comment.employee?.first_name} {comment.employee?.last_name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-400">
                                            <div className="text-3xl mb-2">💭</div>
                                            <p>Aucun commentaire pour le moment</p>
                                        </div>
                                    )}
                                </div>

                                {/* Formulaire nouveau commentaire */}
                                <form onSubmit={handleCommentSubmit} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Écrire un commentaire..."
                                        className="flex-1 border border-slate-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                    <button 
                                        type="submit" 
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                                    >
                                        Envoyer
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TaskDetailsModal;