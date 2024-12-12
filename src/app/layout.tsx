import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar"; // Import your Navbar component
import "./globals.css";
import { AuthProvider } from "@/utils/AuthContext"; // Import AuthProvider for authentication context

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

export const metadata: Metadata = {
    title: "MyCargonaut",
    description: "A platform for ride and freight sharing",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {/* Wrap the application with AuthProvider */}
        <AuthProvider>
            {/* Add the Navbar for consistent navigation */}
            <Navbar />

            {/* Main page content */}
            <main>{children}</main>
        </AuthProvider>
        </body>
        </html>
    );
}
