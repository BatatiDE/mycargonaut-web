"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { authApi, profileApi } from "@/utils/api";
import {useRouter} from "next/navigation"; // Use the existing authApi
interface User {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    const router = useRouter(); // Initialize the router


    // Load token and user from localStorage on app start
    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    // Login function
    const login = async (email: string, password: string) => {
        const { token, user } = await authApi.login(email, password);

        // 🔥 Sicherstellen, dass ID eine Zahl ist
        const parsedUser = { ...user, id: Number(user.id) };

        setToken(token);
        setUser(parsedUser);

        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(parsedUser));
    };


    // Logout function
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        router.push('/login'); // Redirect to the login page

    };

    // Refresh user profile
    const refreshUser = async () => {
        try {
            const updatedUser = await profileApi.fetchProfile();
            setUser(updatedUser);
            localStorage.setItem("authUser", JSON.stringify(updatedUser));
        } catch (error) {
            console.error("Failed to refresh user data:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                setToken,
                setUser,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
