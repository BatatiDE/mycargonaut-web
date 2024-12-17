"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/utils/AuthContext"; // Import AuthContext
import { useState } from "react";

const Navbar = () => {
    const { user, logout } = useAuth(); // Access the authenticated user and logout
    const pathname = usePathname();
    const [isMenuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Trips", path: "/trips" },
        { name: "Tracking", path: "/tracking" },
        { name: "Profile", path: "/profile" },
    ];

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold">
                    MyCargonaut
                </Link>

                {/* Toggle Menu for Mobile */}
                <button
                    className="block md:hidden text-xl"
                    onClick={() => setMenuOpen(!isMenuOpen)}
                >
                    ☰
                </button>

                {/* Navigation Links */}
                <div
                    className={`${
                        isMenuOpen ? "block" : "hidden"
                    } md:flex md:gap-4 items-center`}
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`px-3 py-2 rounded ${
                                pathname === item.path
                                    ? "bg-white text-blue-600 font-bold"
                                    : "hover:bg-blue-700"
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* Dashboard Button - Conditional Rendering */}
                    {user && (
                        <Link
                            href="/dashboard"
                            className={`px-3 py-2 rounded ${
                                pathname === "/dashboard"
                                    ? "bg-white text-blue-600 font-bold"
                                    : "hover:bg-blue-700"
                            }`}
                        >
                            Dashboard
                        </Link>
                    )}

                    {/* Authentication Links */}
                    {user ? (
                        <>
                            <span className="px-3 py-2">
                                Welcome, {user.name || user.email}
                            </span>
                            <button
                                onClick={logout}
                                className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className={`px-3 py-2 rounded ${
                                    pathname === "/login"
                                        ? "bg-white text-blue-600 font-bold"
                                        : "hover:bg-blue-700"
                                }`}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className={`px-3 py-2 rounded ${
                                    pathname === "/register"
                                        ? "bg-white text-blue-600 font-bold"
                                        : "hover:bg-blue-700"
                                }`}
                            >
                                Register
                            </Link>

                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
