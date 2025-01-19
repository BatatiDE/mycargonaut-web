'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import { useAuth } from "@/utils/AuthContext";
import { useState } from 'react';
import { getErrorMessage } from "@/utils/errorHandler";
import Link from "next/link";

export default function LoginForm() {
    const { login } = useAuth(); // Use login from AuthContext
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter();
    const [error, setError] = useState("");


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password); // Call the login function from AuthContext
            console.log("login called");
            console.log("Navigating to dashboard");
            router.push("/create"); // Redirect to dashboard on successful login
        } catch (err) {
            const message = getErrorMessage(err);
            setError(message);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required onChange={(e) => setEmail(e.target.value)}
                       value={email}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required
                       onChange={(e) => setPassword(e.target.value)} value={password}/>
            </div>
            <Button type="submit" className="w-full">Login</Button>
            <div className="mt-4 text-center text-sm">
                Noch kein Konto?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                    Registrieren
                </Link>
            </div>
        </form>
    )
}

