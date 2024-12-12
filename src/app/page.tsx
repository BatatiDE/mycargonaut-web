"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        router.push(`/search?from=${from}&to=${to}&date=${date}`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Welcome to MyCargonaut
                </h1>
                <p className="text-gray-600">
                    Find or offer rides and freight-sharing solutions quickly and
                    effortlessly.
                </p>
            </header>

            <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                    Quick Search
                </h2>
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            From
                        </label>
                        <input
                            type="text"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            placeholder="Enter starting location"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            To
                        </label>
                        <input
                            type="text"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder="Enter destination"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
                    >
                        Search Now
                    </button>
                </form>
            </div>

            <footer className="mt-10 text-gray-500">
                <button
                    onClick={() => router.push("/register")}
                    className="text-blue-500 hover:underline"
                >
                    Get Started
                </button>
            </footer>
        </div>
    );
}
