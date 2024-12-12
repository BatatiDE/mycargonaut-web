export interface AuthResponse {
    message: string; // Example success message from registration
}

export interface LoginResponse {
    token?: string; // Add token if your backend provides it
    message: string; // Success or error message
}
