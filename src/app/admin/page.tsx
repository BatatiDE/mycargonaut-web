"use client";

import { useEffect, useState } from "react";

export default function AdminPanel() {
    const [metrics, setMetrics] = useState({ users: 0, transactions: 0, revenue: 0 });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch("/api/admin/metrics");
                const data = await response.json();
                setMetrics(data);
            } catch (error) {
                console.error("Error fetching admin metrics:", error);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded shadow-md text-center">
                    <h2 className="text-xl font-semibold">Active Users</h2>
                    <p>{metrics.users}</p>
                </div>
                <div className="bg-white p-6 rounded shadow-md text-center">
                    <h2 className="text-xl font-semibold">Total Transactions</h2>
                    <p>{metrics.transactions}</p>
                </div>
                <div className="bg-white p-6 rounded shadow-md text-center">
                    <h2 className="text-xl font-semibold">Revenue</h2>
                    <p>${metrics.revenue}</p>
                </div>
            </div>
        </div>
    );
}
