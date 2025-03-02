'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from 'next/navigation'
import { authApi } from '@/utils/api'
import {AlertDialog, AlertDialogDescription, AlertDialogTrigger} from "@/components/ui/alert-dialog"
import Link from "next/link";

export default function RegisterForm() {
    const [isOver18, setIsOver18] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('') // New state for password confirmation
    const [birthDate, setBirthDate] = useState('')
    const [error, setError] = useState<string | null>(null) // New state for error handling
    const router = useRouter()

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null); // Fehler zurücksetzen

        if (password !== confirmPassword) {
            setError("Passwörter stimmen nicht überein.");
            return;
        }

        if (!isOver18) {
            setError("Du musst 18 Jahre oder älter sein.");
            return;
        }

        try {
            const userData = {
                firstName,
                lastName,
                email,
                password,
                birthdate: birthDate, // Direkt als String senden
            };

            console.log("Sende Registrierungsdaten:", userData);
            // const data = await authApi.register(userData);
            await authApi.register(userData);
            console.log("Registrierung erfolgreich:", userData);
            router.push('/login'); // Weiterleitung nach Login
        } catch (error: any) {
            console.error("Registrierung fehlgeschlagen:", error);
            setError(error.response?.data?.message || "Registrierung fehlgeschlagen. Bitte versuche es erneut.");
        }
    };

    const calculateAge = (birthdate: Date): number => {
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const m = today.getMonth() - birthdate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {error && (
                <AlertDialog>
                    <AlertDialogTrigger>Open</AlertDialogTrigger>
                    <AlertDialogDescription>{error}</AlertDialogDescription>
                </AlertDialog>
            )}
            <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" required value={firstName}
                       onChange={(e) => setFirstName(e.target.value)}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" required value={lastName}
                       onChange={(e) => setLastName(e.target.value)}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email}
                       onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password}
                       onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" required value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="isOver18" checked={isOver18}
                          onCheckedChange={() => setIsOver18(!isOver18)}/>
                <Label htmlFor="isOver18">I am 18 years or older</Label>
            </div>
            {isOver18 && (
                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" required value={birthDate}
                           onChange={(e) => setBirthDate(e.target.value)}/>
                </div>
            )}
            <Button type="submit" className="w-full">Register</Button>
            <div className="mt-4 text-center text-sm">
                Sie haben bereits ein Konto?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                    Anmelden
                </Link>
            </div>
        </form>
    )
}

