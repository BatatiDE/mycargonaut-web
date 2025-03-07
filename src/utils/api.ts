import { User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const apiFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("authToken"); // Einheitlich "authToken" nutzen
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Etwas ist schiefgelaufen");
    }

    return response.json();
};

// --- AUTH API ---
export const authApi = {
    register: async (userData: { email: string; password: string }) =>
        apiFetch("/users/register", { method: "POST", body: JSON.stringify(userData) }),
    login: async (email: string, password: string) =>
        apiFetch("/users/login", { method: "POST", body: JSON.stringify({ email, password }) }),
};

// --- USER API ---
export const userApi = {
    getProfile: async (): Promise<User> => apiFetch("/users/me", { method: "GET" }),
    updateProfile: async (userData: Partial<User>): Promise<User> =>
        apiFetch("/users/me", { method: "PUT", body: JSON.stringify(userData) }),
};

// --- OFFERS API ---
export const offerApi = {
    createOffer: async (data: {
        start: string;
        destination: string;
        date: string;
        payloadDetails: string;
        price: number;
    }): Promise<void> =>
        apiFetch("/offers", { method: "POST", body: JSON.stringify(data) }),
};

// --- MESSAGES API ---
export const messagesApi = {
    fetchConversations: async () => apiFetch("/messages", { method: "GET" }),
    sendMessage: async (conversationId: string, message: string) =>
        apiFetch(`/messages/${conversationId}`, { method: "POST", body: JSON.stringify({ message }) }),
};

// --- PAYMENT API ---
export const paymentApi = {
    initiatePayment: async (data: { amount: number; serviceId: string }) =>
        apiFetch("/payments/initiate", { method: "POST", body: JSON.stringify(data) }),
    confirmPayment: async (paymentId: string) =>
        apiFetch(`/payments/confirm/${paymentId}`, { method: "POST" }),
};

export const updateProfile = async (userData: Record<string, unknown>): Promise<User> =>
    apiFetch("/users/me", { method: "PUT", body: JSON.stringify(userData) });

export default apiFetch;
