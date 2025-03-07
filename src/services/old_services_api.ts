const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
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
    throw new Error(error.message || "Etwas ist schief gelaufen");
  }

  return response.json();
};

// --- USERS API ---
export const login = async (email: string, password: string) =>
  apiFetch("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = async (userData: any) =>
  apiFetch("/users/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const getUserProfile = async (userId: string) =>
  apiFetch(`/users/${userId}`, { method: "GET" });

export const updateUserProfile = async (userId: string, userData: any) =>
  apiFetch(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });

/*// --- RIDES API ---
export const createRide = async (rideData: any) => {
    return apiFetch('/rides', {
        method: 'POST',
        body: JSON.stringify(rideData),
    });
};

export const getRide = async (rideId: string) => {
    return apiFetch(`/rides/${rideId}`, { method: 'GET' });
};

export const getUpcomingRides = async () => {
    return apiFetch('/rides/upcoming', { method: 'GET' });
};

export const getUserRides = async (userId: string) => {
    return apiFetch(`/rides/user/${userId}`, { method: 'GET' });
};

export const updateRide = async (rideId: string, rideData: any) => {
    return apiFetch(`/rides/${rideId}`, {
        method: 'PUT',
        body: JSON.stringify(rideData),
    });
};

export const deleteRide = async (rideId: string) => {
    return apiFetch(`/rides/${rideId}`, { method: 'DELETE' });
};*/

export default {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  /*createRide,
    getRide,
    getUpcomingRides,
    getUserRides,
    updateRide,
    deleteRide,*/
};
