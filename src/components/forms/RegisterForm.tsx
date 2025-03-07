"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/utils/api";

export default function RegisterForm() {
  const [isOver18, setIsOver18] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for password confirmation
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null); // New state for error handling
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (isOver18) {
      try {
        const userData = {
          firstName,
          lastName,
          email,
          password,
          birthdate: calculateAge(birthDate),
        };
        await authApi.register(userData);
        // Redirect to login page or directly log in the user
        router.push("/login");
      } catch (error) {
        console.error("Registration failed:", error);
        setError("Registration failed. Please try again.");
      }
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
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
        <Input
          id="firstName"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isOver18"
          checked={isOver18}
          onCheckedChange={() => setIsOver18(!isOver18)}
        />
        <Label htmlFor="isOver18">I am 18 years or older</Label>
      </div>
      {isOver18 && (
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
      )}
      <Button type="submit" className="w-full">
        Register
      </Button>
      <div className="mt-4 text-center text-sm">
        Sie haben bereits ein Konto?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Anmelden
        </Link>
      </div>
    </form>
  );
}
