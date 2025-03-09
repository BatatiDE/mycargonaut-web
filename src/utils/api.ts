import { User } from "@/types/user";

const API_URL = "http://localhost:8080/api";

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else if (contentType && contentType.includes("text/plain")) {
    return await response.text();
  } else {
    throw new Error("Unsupported response type");
  }
}

// Authentication APIs
export const authApi = {
  register: async (data: { email: string; password: string }) =>
    apiFetch("/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: async (data: { email: string; password: string }) =>
    apiFetch("/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  resetPassword: async (email: string) =>
    apiFetch("/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

// Tracking APIs
export const trackingApi = {
  getDriverLocation: async (driverId: string) =>
    apiFetch(`/tracking/driver/${driverId}`, {
      method: "GET",
    }),
  updateDriverStatus: async (driverId: string, status: string) =>
    apiFetch(`/tracking/driver/${driverId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// Profile API
export const profileApi = {
  getProfile: async (): Promise<User> =>
    fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    }),

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
    apiFetch("/messages", {
      method: "GET",
    }),
  sendMessage: async (conversationId: string, message: string) =>
    apiFetch(`/messages/${conversationId}`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  fetchMessages: async (conversationId: string) =>
    apiFetch(`/messages/${conversationId}`, {
      method: "GET",
    }),
};

// Reviews APIs
export const reviewApi = {
  submitReview: async (data: {
    targetUserId: string;
    rating: number;
    comment: string;
  }) =>
    apiFetch("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  fetchReviews: async (userId: string) =>
    apiFetch(`/reviews/user/${userId}`, {
      method: "GET",
    }),
};

// Search APIs
export const searchApi = {
  searchOffers: async (filters: { from: string; to: string }) => {
    const response = await apiFetch("/search", {
      method: "POST",
      body: JSON.stringify(filters),
    });
    return response;
  },
};

// Payment APIs
export const paymentApi = {
  initiatePayment: async (data: { amount: number; serviceId: string }) =>
    apiFetch("/payments/initiate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  confirmPayment: async (paymentId: string) =>
    apiFetch(`/payments/confirm/${paymentId}`, {
      method: "POST",
    }),
};

export default apiFetch;
