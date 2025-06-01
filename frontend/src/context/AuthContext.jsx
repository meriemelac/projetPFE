import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosSanctum"; // ← axios avec withCredentials

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // pour attendre la vérif initiale

    // 🔄 Vérification de session Sanctum au démarrage
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axiosInstance.get("/sanctum/csrf-cookie");
                const res = await axiosInstance.get("/api/me");
                setUser(res.data);
                setIsAuthenticated(true);
            } catch (error) {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // ✅ Login avec session Sanctum
    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
    };


    // 🚪 Déconnexion (et suppression session)
    const logout = async () => {
        try {
            await axiosInstance.post("/api/logout");
        } catch (err) {
            console.error("Erreur de déconnexion :", err);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // 🕐 Attente de vérification initiale
    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
