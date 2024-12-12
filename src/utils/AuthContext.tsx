"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void; // Add logout method
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    setToken: () => {},
    setUser: () => {},
    login: async () => {},
    logout: () => {}, // Default empty logout implementation
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");

        if (storedToken) {
            setToken(storedToken);
        }

        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser) as User);
            } catch (error) {
                console.error("Error parsing stored user data:", error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`);
            }

            const { token, user } = await response.json();
            setToken(token);
            setUser(user);

            localStorage.setItem("authToken", token);
            localStorage.setItem("authUser", JSON.stringify(user));
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
    };

    return (
        <AuthContext.Provider value={{ token, user, setToken, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
