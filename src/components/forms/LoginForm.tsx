"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/utils/errorHandler";

export default function LoginForm() {
  const { login } = useAuth(); // Use login from AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      console.log("login called");
      console.log("Navigating to dashboard");
      router.push("/create");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
      <div className="mt-4 text-center text-sm">
        Noch kein Konto?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Registrieren
        </Link>
      </div>
    </form>
  );
}
