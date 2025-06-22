import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import echo from './echo';
import axiosSanctum from '../api/axiosSanctum';

const Chat = () => {
    const { id: receiverId } = useParams();
    const navigate = useNavigate();
    
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [authUserId, setAuthUserId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    
    // États pour la liste des employés
    const [employees, setEmployees] = useState([]);
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Fonction pour faire défiler vers le bas
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Charger la liste des employés
    const loadEmployees = useCallback(async () => {
        try {
            const response = await axiosSanctum.get('/api/employees');
            setEmployees(response.data);
            
            // Si un receiverId est dans l'URL, trouver l'employé correspondant
            if (receiverId) {
                const employee = response.data.find(emp => emp.id == receiverId);
                setSelectedEmployee(employee);
            }
        } catch (error) {
            console.error("Erreur chargement employés :", error);
        } finally {
            setIsLoadingEmployees(false);
        }
    }, [receiverId]);

    // Charger les anciens messages
    const loadMessages = useCallback(async (userId) => {
        if (!receiverId) return;
        
        try {
            const response = await axiosSanctum.get(`/api/messages/${receiverId}`);
            const sortedMessages = response.data.sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
            
            console.log("Messages chargés :", sortedMessages);
            setMessages(sortedMessages);
        } catch (error) {
            console.error("Erreur chargement messages :", error);
        }
    }, [receiverId]);

    // Vérifier l'authentification et charger les données
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axiosSanctum.get('/sanctum/csrf-cookie');
                const response = await axiosSanctum.get('/api/me');
                const userId = response.data.id;
                
                setAuthUserId(userId);
                setIsAuthenticated(true);
                console.log("User connecté :", response.data);
                
                // Charger les employés et les messages en parallèle
                await Promise.all([
                    loadEmployees(),
                    loadMessages(userId)
                ]);
            } catch (error) {
                console.error("Erreur auth Sanctum :", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [loadMessages, loadEmployees]);

    // Écoute en temps réel via Pusher
    useEffect(() => {
        if (!authUserId || !isAuthenticated) return;

        const channel = echo.private(`chat.${authUserId}`)
            .listen('MessageSent', (e) => {
                console.log("📥 Nouveau message reçu :", e);
                // Ne mettre à jour que si le message concerne la conversation actuelle
                if (e.sender_id == receiverId || e.receiver_id == receiverId) {
                    setMessages(prev => [
                        ...prev,
                        {
                            message: e.message,
                            sender_id: e.sender_id,
                            created_at: new Date().toISOString(),
                        },
                    ]);
                }
            });

        return () => {
            echo.leave(`chat.${authUserId}`);
        };
    }, [authUserId, isAuthenticated, receiverId]);

    // Scroll automatique vers le bas à chaque nouveau message
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Recharger les messages quand receiverId change
    useEffect(() => {
        if (authUserId && receiverId) {
            setMessages([]); // Vider les anciens messages
            loadMessages(authUserId);
            
            // Mettre à jour l'employé sélectionné
            const employee = employees.find(emp => emp.id == receiverId);
            setSelectedEmployee(employee);
        }
    }, [receiverId, authUserId, loadMessages, employees]);

    // Sélectionner un employé pour chatter
    const selectEmployee = useCallback((employee) => {
        navigate(`/chat/${employee.id}`);
    }, [navigate]);

    // Envoyer un message
    const sendMessage = useCallback(async () => {
        if (!input.trim() || !isAuthenticated || isSending || !receiverId) return;

        setIsSending(true);
        
        try {
            const response = await axiosSanctum.post('/api/messages', {
                receiver_id: receiverId,
                message: input.trim(),
            });

            setMessages(prev => [...prev, response.data]);
            setInput('');
            
            // Focus sur l'input après envoi
            setTimeout(() => inputRef.current?.focus(), 100);
        } catch (error) {
            console.error("Erreur envoi message :", error);
        } finally {
            setIsSending(false);
        }
    }, [input, isAuthenticated, isSending, receiverId]);

    // Gérer l'appui sur Entrée
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }, [sendMessage]);

    // Formater l'heure d'affichage
    const formatTime = useCallback((dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }, []);

    // Composant de message individuel
    const MessageItem = ({ msg, index }) => {
        const isSender = msg.sender_id == authUserId;
        
        return (
            <div
                key={index}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}
            >
                <div
                    className={`
                        max-w-[80%] p-3 rounded-lg shadow-sm
                        ${isSender
                            ? 'bg-blue-500 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                        }
                    `}
                >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                    </div>
                    {msg.created_at && (
                        <div className={`
                            text-xs mt-2 
                            ${isSender ? 'text-blue-100' : 'text-gray-500'}
                        `}>
                            {formatTime(msg.created_at)}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Composant d'un employé dans la liste
    const EmployeeItem = ({ employee }) => {
        const isSelected = employee.id == receiverId;
        
        return (
            <div
                onClick={() => selectEmployee(employee)}
                className={`
                    p-3 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50
                    ${isSelected ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''}
                `}
            >
                <div className="flex items-center !space-x-3 ">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                            {employee.first_name ? employee.first_name.charAt(0).toUpperCase() : 
                             employee.name ? employee.name.charAt(0).toUpperCase() : 'E'}
                        </span>
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-gray-800">
                            {employee.first_name && employee.last_name 
                                ? `${employee.first_name} ${employee.last_name}`
                                : employee.name || `Employé #${employee.id}`
                            }
                        </div>
                        <div className="text-sm text-gray-500">
                            {employee.email || 'Aucun email'}
                        </div>
                    </div>
                    {isSelected && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                </div>
            </div>
        );
    };

    // État de chargement
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 min-h-screen">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Chargement...</span>
                </div>
            </div>
        );
    }

    // État non authentifié
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center p-8 min-h-screen">
                <div className="p-6 border border-red-200 rounded-lg bg-red-50 max-w-md">
                    <div className="text-center">
                        <div className="text-red-600 font-medium mb-2">Erreur d'authentification</div>
                        <div className="text-red-500 text-sm">Veuillez vous reconnecter</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[675px] bg-gray-100">
            {/* Liste des employés */}
            <div className="bg-white border-r border-gray-200 flex flex-col"
            style={{width: "350px"}}>
                <div className="p-2 px-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Liste des employés
                    </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto !width-[400px]">
                    {isLoadingEmployees ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-gray-600 text-sm">Chargement des employés...</span>
                            </div>
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <div className="text-sm">Aucun employé trouvé</div>
                        </div>
                    ) : (
                        employees.map((employee) => (
                            <EmployeeItem key={employee.id} employee={employee} />
                        ))
                    )}
                </div>
            </div>

            {/* Zone de chat */}
            <div className="flex-1 flex flex-col">
                {!receiverId ? (
                    // État initial - aucun employé sélectionné
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                Sélectionnez un employé
                            </h3>
                            <p className="text-gray-500">
                                Choisissez un employé dans la liste pour commencer une conversation
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* En-tête du chat */}
                        <div className="bg-white border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center !mx-3">
                                    <span className="text-sm font-medium text-gray-600">
                                        {selectedEmployee?.first_name ? selectedEmployee.first_name.charAt(0).toUpperCase() : 
                                         selectedEmployee?.name ? selectedEmployee.name.charAt(0).toUpperCase() : 'E'}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-0">
                                        {selectedEmployee?.first_name && selectedEmployee?.last_name 
                                            ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
                                            : selectedEmployee?.name || `Employé #${receiverId}`
                                        }
                                    </h2>
                                </div>
                            </div>
                        </div>
                        
                        {/* Zone des messages */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 p-2 space-y-1">
                            {messages.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center text-gray-500">
                                        <div className="text-sm">Aucun message pour le moment</div>
                                        <div className="text-xs mt-1">Commencez la conversation !</div>
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, index) => (
                                    <MessageItem key={index} msg={msg} index={index} />
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        
                        {/* Zone de saisie */}
                        <div className="border-t bg-white p-2">
                            <div className="flex gap-3">
                                <input
                                    ref={inputRef}
                                    className="
                                        flex-1 p-3 border border-gray-300 rounded-lg 
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        placeholder-gray-400 text-sm
                                    "
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Écrire un message..."
                                    disabled={isSending}
                                />
                                <button
                                    className={`
                                        px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200
                                        ${(!input.trim() || isSending)
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-500 hover:bg-blue-600 shadow-sm hover:shadow-md'
                                        }
                                    `}
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isSending}
                                >
                                    {isSending ? (
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Envoi...
                                        </div>
                                    ) : (
                                        'Envoyer'
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Chat;