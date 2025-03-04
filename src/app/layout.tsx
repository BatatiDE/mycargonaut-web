import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { AuthProvider } from "@/utils/AuthContext";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyCargonaut",
  description: "Eine Plattform für Mitfahrgelegenheiten und Frachttransporte",
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
        <div className="flex min-h-screen flex-col">
          <AuthProvider>
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
