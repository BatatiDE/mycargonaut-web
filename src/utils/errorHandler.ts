export interface ApiError {
    status?: number; // HTTP status code
    data?: {
        message?: string; // General error message
        details?: Record<string, string>; // Field-specific validation errors
    };
}

export function getErrorMessage(error: unknown): string {
    // Handle structured API errors
    if (typeof error === "object" && error !== null) {
        const apiError = error as ApiError;

        if (apiError.data) {
            const { message, details } = apiError.data;

            // If there are validation details, format them nicely
            if (details && typeof details === "object") {
                const formattedDetails = Object.entries(details)
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join(", ");
                return `${message}: ${formattedDetails}`;
            }

            // Return the main message if no details are present
            return message || "An error occurred.";
        }

        // Handle HTTP status code-based errors
        if (apiError.status) {
            switch (apiError.status) {
                case 401:
                    return "Unauthorized. Please log in again.";
                case 403:
                    return "Forbidden. You don't have permission to access this.";
                case 404:
                    return "Not found. The resource you're looking for doesn't exist.";
                case 500:
                    return "Server error. Please try again later.";
                default:
                    return `Unexpected error occurred (status code: ${apiError.status}).`;
            }
        }
    }

    // Handle native JavaScript errors
    if (error instanceof Error) {
        return error.message;
    }

    // Fallback for unknown errors
    return "An unknown error occurred.";
}
