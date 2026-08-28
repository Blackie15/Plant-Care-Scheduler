import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getToken, logoutUser, getCurrentUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const refreshUser = useCallback(async () => {
        const currentToken = getToken();
        if (!currentToken) {
            setUser(null);
            setLoadingUser(false);
            return null;
        }

        try {
            setLoadingUser(true);
            const userData = await getCurrentUser();
            setUser(userData);
            return userData;
        } catch (err) {
            console.warn("Could not fetch authenticated user:", err);
            // If token is expired or unauthorized
            if (err?.message && (err.message.includes("401") || err.message.includes("403"))) {
                logoutUser();
                setToken(null);
                setUser(null);
            }
            return null;
        } finally {
            setLoadingUser(false);
        }
    }, []);

    useEffect(() => {
        if (token) {
            refreshUser();
        } else {
            setUser(null);
            setLoadingUser(false);
        }
    }, [token, refreshUser]);

    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        logoutUser();
        setToken(null);
        setUser(null);
    };

    const updateUserState = (updatedUser) => {
        setUser((prev) => ({ ...prev, ...updatedUser }));
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                loadingUser,
                login,
                logout,
                refreshUser,
                updateUserState,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};