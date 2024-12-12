import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    return <>{children}</>;
};

export default AuthGuard;
