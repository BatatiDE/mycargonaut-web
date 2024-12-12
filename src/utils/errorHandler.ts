export function getErrorMessage(err: unknown): string {
    if (err instanceof Error) {
        return err.message;
    }

    if (typeof err === "object" && err && "status" in err) {
        const status = (err as { status: number }).status;
        if (status === 401) return "Unauthorized. Please log in again.";
        if (status === 500) return "Server error. Please try again later.";
    }

    return "An unknown error occurred";
}
