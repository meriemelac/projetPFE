import { useEffect, useState } from 'react';
import echo from './echo';
import axiosSanctum from '../api/axiosSanctum';

const Chat = ({ receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [authUserId, setAuthUserId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Vérifier l'authentification et charger les messages
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axiosSanctum.get('/sanctum/csrf-cookie');
                const response = await axiosSanctum.get('/api/me');
                const userId = response.data.id;
                setAuthUserId(userId);
                setIsAuthenticated(true);
                console.log("User connecté :", response.data);
                await loadMessages(userId);
            } catch (error) {
                console.error("Erreur auth Sanctum :", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Charger les anciens messages
    const loadMessages = async (userId) => {
        try {
            const response = await axiosSanctum.get(`/api/messages/${receiverId}`);
            const sorted = response.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            
            console.log("Messages chargés :", sorted);
            setMessages(sorted);
        } catch (error) {
            console.error("Erreur chargement messages :", error);
        }
    };

    // Écoute en temps réel via Pusher
    useEffect(() => {
        if (!authUserId || !isAuthenticated) return;

        const channel = echo.private(`chat.${authUserId}`)
            .listen('MessageSent', (e) => {
                console.log("📥 Nouveau message reçu :", e);
                setMessages(prev => [
                    ...prev,
                    {
                        message: e.message,
                        sender_id: e.sender_id,
                        created_at: new Date().toISOString(),
                    },
                ]);
            });

        return () => {
            echo.leave(`chat.${authUserId}`);
        };
    }, [authUserId, isAuthenticated]);

    // Scroll automatique vers le bas à chaque nouveau message
    useEffect(() => {
        const container = document.getElementById('messages-box');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    // Envoyer un message
    const sendMessage = async () => {
        if (!input.trim() || !isAuthenticated) return;

        try {
            const response = await axiosSanctum.post('/api/messages', {
                receiver_id: receiverId,
                message: input,
            });

            setMessages(prev => [...prev, response.data]);
            setInput('');
        } catch (error) {
            console.error("Erreur envoi message :", error);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 border rounded-md max-w-md mx-auto">
                <div className="text-center">Chargement du profil...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="p-4 border rounded-md max-w-md mx-auto">
                <div className="text-center text-red-500">Erreur d'authentification</div>
            </div>
        );
    }

    return (
        <div className="p-4 border rounded-md max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-2">Chat avec employé #{receiverId}</h2>
            
            <div
                id="messages-box"
                className="h-64 overflow-y-auto bg-gray-100 p-2 rounded"
            >
                {messages.map((msg, index) => {
                    // Utiliser == au lieu de === pour gérer la différence string/number
                    const isSender = msg.sender_id == authUserId;
                    
                    return (
                        <div
                            key={index}
                            className={`p-2 my-1 rounded max-w-[80%] ${
                                isSender
                                    ? 'bg-blue-300 text-right ml-auto'
                                    : 'bg-gray-300 text-left mr-auto'
                            }`}
                        >
                            <span className="block text-sm">{msg.message}</span>
                            {msg.created_at && (
                                <span className="block text-xs text-gray-500 mt-1">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-2 flex gap-2">
                <input
                    className="flex-1 p-2 border rounded"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Écrire un message..."
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={sendMessage}
                    disabled={!input.trim()}
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
};

export default Chat;