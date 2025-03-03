import {User} from "@/types/user";

const API_URL = 'http://localhost:8080/api'; // Replace with your backend URL

// Generic Fetch Helper
async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("authToken");

    if (!token) {
        console.warn("Kein Token gefunden. User wird ausgeloggt.");
        window.location.href = "/login"; // Automatisches Logout
        throw new Error("Unauthorized");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        ...options,
    });

    if (!response.ok) {
        if (response.status === 401) {  // Falls Token abgelaufen oder ungültig
            console.warn("Token ungültig. User wird ausgeloggt.");
            localStorage.removeItem("authToken");
            window.location.href = "/login";
        }
        throw new Error(`Error: ${response.status}`);
    }

    return response.json();
}

// Authentication APIs
export const authApi = {
    register: async (userData: any) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                // API gibt einen Fehlerstatus zurück (z. B. 400)
                const errorData = await response.text();
                throw new Error(errorData || "Registrierung fehlgeschlagen");
            }

            return await response.json();
        } catch (error) {
            console.error("Fehler bei der Registrierung:", error);
            throw error;
        }
    },

    login: async (email: string, password: string) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Login fehlgeschlagen");
            }

            const data = await response.json();
            localStorage.setItem("authToken", data.token);  // 🔥 Token speichern!
            return data;
        } catch (error) {
            console.error("Fehler beim Login:", error);
            throw error;
        }
    },
    logout: () => {
        localStorage.removeItem("authToken");
        window.location.href = "/login";  // User zum Login umleiten
    },
    resetPassword: async (email: string) =>
        apiFetch('/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),
};

// Offer/Request APIs
export const offerApi = {
    createOffer: async (data: {
        start: string;
        destination: string;
        date: string;
        payloadDetails: string;
        price: number;
    }) =>
        apiFetch('/offers', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    fetchOffers: async (filters: { from?: string; to?: string; date?: string }) =>
        apiFetch('/offers/search', {
            method: 'POST',
            body: JSON.stringify(filters),
        }),
    getOfferDetails: async (id: string) =>
        apiFetch(`/offers/${id}`, {
            method: 'GET',
        }),
};

// Tracking APIs
export const trackingApi = {
    getDriverLocation: async (driverId: string) =>
        apiFetch(`/tracking/driver/${driverId}`, {
            method: 'GET',
        }),
    updateDriverStatus: async (driverId: string, status: string) =>
        apiFetch(`/tracking/driver/${driverId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        }),
};

// Profile APIs
export const profileApi = {
    fetchProfile: async (): Promise<User> => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.warn("Kein Token gefunden. User wird ausgeloggt.");
            window.location.href = "/login";
            throw new Error("Unauthorized");
        }

        const response = await fetch(`${API_URL}/users/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.warn("Token ungültig. User wird ausgeloggt.");
                localStorage.removeItem("authToken");
                window.location.href = "/login";
            }
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await fetch(`${API_URL}/users/me`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // Properly serialize to JSON
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    },

};


// Communication APIs
export const messagesApi = {
    fetchConversations: async () =>
        apiFetch('/messages', {
            method: 'GET',
        }),
    sendMessage: async (conversationId: string, message: string) =>
        apiFetch(`/messages/${conversationId}`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        }),
    fetchMessages: async (conversationId: string) =>
        apiFetch(`/messages/${conversationId}`, {
            method: 'GET',
        }),
};

// Reviews APIs
export const reviewApi = {
    submitReview: async (data: {
        targetUserId: string;
        rating: number;
        comment: string;
    }) =>
        apiFetch('/reviews', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    fetchReviews: async (userId: string) =>
        apiFetch(`/reviews/user/${userId}`, {
            method: 'GET',
        }),
};

// Search APIs
export const searchApi = {
    searchOffers: async (filters: { from: string; to: string }) => {
        const response = await apiFetch('/search', {
            method: 'POST',
            body: JSON.stringify(filters),
        });
        return response;
    },
};

// Create Offer APIs
export const createOffer = async (data: {
    startingPoint: string;
    destinationPoint: string;
    date: string;
    payloadDetails: string;
    price: number;
    notes?: string; // Optional notes
}) => {
    return apiFetch('/offer', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// Payment APIs
export const paymentApi = {
    initiatePayment: async (data: { amount: number; serviceId: string }) =>
        apiFetch('/payments/initiate', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    confirmPayment: async (paymentId: string) =>
        apiFetch(`/payments/confirm/${paymentId}`, {
            method: 'POST',
        }),
};

export default apiFetch;
