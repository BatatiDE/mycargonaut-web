import type {Metadata, Viewport} from "next";
import { Inter } from 'next/font/google'
import Navbar from "@/components/Navbar"; // Import your Navbar component
import "./globals.css";
import { AuthProvider } from "@/utils/AuthContext"; // Import AuthProvider for authentication context
import ErrorBoundary from "@/components/ErrorBoundary"; // Import ErrorBoundary
import { Suspense } from "react"; // For lazy loading
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Footer from "@/components/Footer"; // A global loading spinner

const inter = Inter({ subsets: ['latin'] })


// Metadata
export const metadata: Metadata = {
    title: "MyCargonaut",
    description: "Ein Plattform für Mitfahrgelegenheiten und Frachttransporte"
};

// Viewport Configuration
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
        <head>
            {/* SEO Improvements */}
            <link rel="icon" href="/favicon.ico" />
            <meta charSet="UTF-8" />
            <meta
                name="description"
                content="MyCargonaut - A modern platform for ride and freight sharing."
            />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <title>MyCargonaut</title>
        </head>
        <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
            <AuthProvider>
                <ErrorBoundary>
                    {/* Loading State for Suspense Components */}
                    <Suspense fallback={<LoadingSpinner/>}>
                        {/* Navigation Bar */}
                        <Navbar/>

                        {/* Main Content */}
                        <main className="flex-grow px-4 sm:px-6 lg:px-8">
                            {children}
                        </main>
                        <Footer/>
                    </Suspense>
                </ErrorBoundary>
            </AuthProvider>
        </div>
        </body>
        </html>
);
}
