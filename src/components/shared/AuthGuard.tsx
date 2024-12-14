"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsAuthenticated(true);
        } else {
            router.push("/login");
        }
        setIsLoading(false);
    }, [router]);

    if (isLoading) {
        return <div>Loading...</div>; // Show a loader while checking authentication
    }

    if (!isAuthenticated) {
        return null; // Ensure no content renders before redirect
    }

    return <>{children}</>;
};

export default AuthGuard;
