//Old Navbar//
/*
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/utils/AuthContext"; // Import AuthContext
import { useState } from "react";
import {Button} from '@/components/ui/button';

const Navbar = () => {
    const { user, logout } = useAuth(); // Access the authenticated user and logout
    const pathname = usePathname();
    const [isMenuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { name: "Trips", path: "/trips" },
        { name: "Tracking", path: "/tracking" },
        { name: "Profile", path: "/profile" },
    ];

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/!* Logo *!/}
                <Link href="/" className="text-xl font-bold">
                    MyCargonaut
                </Link>

                {/!* Toggle Menu for Mobile *!/}
                <Button
                    className="block md:hidden text-xl"
                    onClick={() => setMenuOpen(!isMenuOpen)}
                >
                    ☰
                </Button>

                {/!* Navigation Links *!/}
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

                    {/!* Dashboard Button - Conditional Rendering *!/}
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

                    {/!* Authentication Links *!/}
                    {user ? (
                        <>
                            <span className="px-3 py-2">
                                Welcome, {user.name || user.email}
                            </span>
                            <Button
                                onClick={logout}>
                                Logout
                            </Button>
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
*/
//New Navbar

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from "@/utils/AuthContext";
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, Search, PlusCircle, User, LogIn, UserPlus, LogOut } from 'lucide-react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    const closeMenu = () => setIsOpen(false);

    const NavItems = ({ onItemClick, isMobile = false }: { onItemClick?: () => void, isMobile?: boolean }) => (
        <>
            <Link href="/search" onClick={onItemClick} className={isMobile ? "w-full" : ""}>
                <Button variant="ghost" className={isMobile ? "w-full justify-start px-4" : ""}>
                    <Search className="mr-2 h-4 w-4" />
                    Suchen
                </Button>
            </Link>
            <Link href="/create" onClick={onItemClick} className={isMobile ? "w-full" : ""}>
                <Button variant="ghost" className={isMobile ? "w-full justify-start px-4" : ""}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Angebot/Anfrage erstellen
                </Button>
            </Link>
            {user && (
                <Link href="/profile" onClick={onItemClick} className={isMobile ? "w-full" : ""}>
                    <Button variant="ghost" className={isMobile ? "w-full justify-start px-4" : ""}>
                        <User className="mr-2 h-4 w-4" />
                        Profil & Dashboard
                    </Button>
                </Link>
            )}
            {user ? (
                <div className={`flex flex-col ${isMobile ? "px-4" : ""}`}>
                    <Button
                        variant="outline"
                        onClick={logout}
                        className={isMobile ? "w-full border border-red-500 text-red-500 hover:bg-red-50" : "border border-red-500 text-red-500 hover:bg-red-50"}>
                        <LogOut className="mr-2 h-4 w-4"/>
                        Abmelden
                    </Button>
                </div>
                    ) : (
                    isMobile ? (
                    <div className="flex flex-col space-y-2 px-4 mt-4">
                        <Link href="/login" onClick={onItemClick}>
                            <Button variant="outline" className="w-full border border-orange-500 text-orange-500 hover:bg-orange-50">
                                <LogIn className="mr-2 h-4 w-4" />
                                Anmelden
                            </Button>
                        </Link>
                        <Link href="/register" onClick={onItemClick}>
                            <Button variant="default" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Registrieren
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link href="/login" onClick={onItemClick}>
                            <Button variant="outline" className="border border-orange-500 text-orange-500 hover:bg-orange-50">
                                <LogIn className="mr-2 h-4 w-4" />
                                Anmelden
                            </Button>
                        </Link>
                        <Link href="/register" onClick={onItemClick}>
                            <Button variant="default" className="bg-orange-500 hover:bg-orange-600 text-white">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Registrieren
                            </Button>
                        </Link>
                    </>
                )
            )}
        </>
    )

    return (
        <header className="bg-white shadow-sm">
            <nav className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-orange-500">
                    <svg
                        viewBox="0 0 848.17 255.01"
                        className="h-8"
                        fill="currentColor"
                        aria-label="MyCargonaut"
                    >
                        <path d="M689.52 99.68s57.17 6.53 88.21 44.1c23.09 28 21.23 71.88 21.23 71.88s32.3-17.08 28.86-54.08c-2.72-29.23-19.06-43.93-19.06-43.93s-11.81-11.69-9.8-21.24c6.54-31-8.17-27.41-8.17-27.41s-8.88 15.43-21.61 15.43c-15.43 0-49.37-6.17-49.37-6.17L522.3 31.97s-52.46-15.43-151.21-15.43-191.34 86.41-191.34 86.41H99.52l169.73-86.41s27.77-21.6 129.61-15.43C503.64 7.49 553.17 22.71 553.17 22.71l185.16 46.29s17.44 4.54 32.87 4.54 16.34-18 16.34-18 .17-5.1 9.43 1.08 15.43 18.51 15.43 30.86-3.09 12.34 6.17 21.6 27.26 28 29.41 55.9c1.63 21.23-6.54 42.47-26.32 55.2a106.56 106.56 0 0 1-43.21 15.43s11.1-48.57-12.15-78.8c-16.33-21.23-28.67-26.5-44.1-32.67a84.91 84.91 0 0 0-30.16-5.8Z" />
                        <text transform="translate(222.03 220.64)" style={{fontSize: '125.02px', fontFamily: 'Acumin Pro SemiCondensed', fontWeight: '200', fontStyle: 'italic', letterSpacing: '0.02em'}}>
                            Cargonaut
                        </text>
                        <text transform="translate(0 220)" style={{fontSize: '125.02px', fontFamily: 'Brush Script Std'}}>
                            My
                        </text>
                    </svg>
                </Link>
                <div className="lg:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                            <nav className="flex flex-col h-full">
                                <SheetTitle className="px-4 py-6 border-b">MyCargonaut</SheetTitle>
                                <div className="flex-1 overflow-auto py-4 pb-8">
                                    <NavItems onItemClick={closeMenu} isMobile={true} />
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
                <div className="hidden lg:flex items-center space-x-4">
                    <NavItems />
                </div>
            </nav>
        </header>
    )
}
