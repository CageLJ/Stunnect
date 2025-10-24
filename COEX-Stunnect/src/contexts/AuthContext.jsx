import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId"); // Add this
            if (token && userId) {
                try {
                    const response = await fetch(`http://localhost:8000/api/user/${userId}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        // Token invalid/expired
                        localStorage.removeItem("token");
                        localStorage.removeItem("userId");
                    }
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            }
            setLoading(false);
        };

        fetchUserData();
    }, []);

    const login = async (credentials) => {
        const res = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || "Login failed");
        }
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        setUser(data.user);
        return data;
    };

    const register = async (payload) => {
        const res = await fetch("http://localhost:8000/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || "Registration failed");
        }
        const data = await res.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id); 
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId"); // Add this
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};