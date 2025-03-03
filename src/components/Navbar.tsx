'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/utils/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Search, PlusCircle, User, LogIn, UserPlus, LogOut } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(!!user); // Setze Zustand basierend auf User-Existenz
    }, [user]);

    const closeMenu = () => setIsOpen(false);

    const NavItems = ({ onItemClick, isMobile = false }: { onItemClick?: () => void, isMobile?: boolean }) => (
        <>
            <Link href="/search" onClick={onItemClick} className={isMobile ? 'w-full' : ''}>
                <Button variant="ghost" className={isMobile ? 'w-full justify-start px-4' : ''}>
                    <Search className="mr-2 h-4 w-4" />
                    Suchen
                </Button>
            </Link>
            <Link href="/create" onClick={onItemClick} className={isMobile ? 'w-full' : ''}>
                <Button variant="ghost" className={isMobile ? 'w-full justify-start px-4' : ''}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Angebot/Anfrage erstellen
                </Button>
            </Link>
            {isAuthenticated && (
                <Link href="/profile" onClick={onItemClick} className={isMobile ? 'w-full' : ''}>
                    <Button variant="ghost" className={isMobile ? 'w-full justify-start px-4' : ''}>
                        <User className="mr-2 h-4 w-4" />
                        Profil & Dashboard
                    </Button>
                </Link>
            )}
            {isAuthenticated ? (
                <div className={`flex flex-col ${isMobile ? 'px-4' : ''}`}>
                    <Button
                        variant="outline"
                        onClick={() => {
                            logout();
                            setIsAuthenticated(false); // Manuell Zustand setzen
                        }}
                        className={
                            isMobile
                                ? 'w-full border border-red-500 text-red-500 hover:bg-red-50'
                                : 'border border-red-500 text-red-500 hover:bg-red-50'
                        }
                    >
                        <LogOut className="mr-2 h-4 w-4" />
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
    );

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto">
                <nav className="py-4 flex justify-between items-center">
                    <Link href="/" className="text-orange-500">
                        <svg
                            viewBox="0 0 848.17 255.01"
                            className="h-8"
                            fill="currentColor"
                            aria-label="MyCargonaut"
                        >
                            <text transform="translate(222.03 220.64)" style={{ fontSize: '125.02px', fontFamily: 'Acumin Pro SemiCondensed', fontWeight: '200', fontStyle: 'italic', letterSpacing: '0.02em' }}>
                                Cargonaut
                            </text>
                            <text transform="translate(0 220)" style={{ fontSize: '125.02px', fontFamily: 'Brush Script Std' }}>
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
            </div>
        </header>
    );
}