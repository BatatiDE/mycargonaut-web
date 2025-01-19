import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google'
import Navbar from "@/components/Navbar";
import "./globals.css";
import { AuthProvider } from "@/utils/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense } from "react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "MyCargonaut",
    description: "Eine Plattform für Mitfahrgelegenheiten und Frachttransporte"
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1.0,
    maximumScale: 1.0,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="de">
        <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
            <AuthProvider>
                <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                        <Navbar />
                        <main className="flex-grow">
                            {children}
                        </main>
                        <Footer />
                    </Suspense>
                </ErrorBoundary>
            </AuthProvider>
        </div>
        </body>
        </html>
    );
}

