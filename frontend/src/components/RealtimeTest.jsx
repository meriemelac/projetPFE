import { useEffect } from 'react';
import echo from './echo'; // adapte le chemin selon l'emplacement

const RealtimeTest = () => {
    useEffect(() => {
        echo.channel('chat')
            .listen('.message.sent', (e) => {
                console.log('📨 Nouveau message reçu :', e.message);
            });

        // Nettoyage du listener à la sortie du composant
        return () => {
            echo.leave('chat');
        };
    }, []);

    return (
        <div>
            <h2>Écoute des messages en temps réel</h2>
        </div>
    );
};

export default RealtimeTest;
