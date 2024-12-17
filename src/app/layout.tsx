import type {Metadata, Viewport} from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar"; // Import your Navbar component
import "./globals.css";
import { AuthProvider } from "@/utils/AuthContext"; // Import AuthProvider for authentication context
import ErrorBoundary from "@/components/ErrorBoundary"; // Import ErrorBoundary
import { Suspense } from "react"; // For lazy loading
import LoadingSpinner from "@/components/shared/LoadingSpinner"; // A global loading spinner

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

// Metadata
export const metadata: Metadata = {
    title: "MyCargonaut",
    description: "A platform for ride and freight sharing",
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
        <html lang="en">
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
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <AuthProvider>
            <ErrorBoundary>
                {/* Loading State for Suspense Components */}
                <Suspense fallback={<LoadingSpinner />}>
                    {/* Navigation Bar */}
                    <Navbar />

                    {/* Main Content */}
                    <main>{children}</main>
                </Suspense>
            </ErrorBoundary>
        </AuthProvider>
        </body>
        </html>
    );
}
