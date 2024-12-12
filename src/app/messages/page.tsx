"use client";

import { useState } from "react";

const mockMessages = [
    { id: 1, sender: "John Doe", message: "Is the ride still available?" },
    { id: 2, sender: "Jane Smith", message: "Can you transport my package?" },
];

export default function MessagesPage() {
    const [messages] = useState(mockMessages);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Messages</h1>
            {messages.length > 0 ? (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className="bg-white p-4 rounded shadow-md border border-gray-300"
                        >
                            <h2 className="text-lg font-semibold">{msg.sender}</h2>
                            <p>{msg.message}</p>
                            <button className="mt-2 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600">
                                Reply
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No messages yet.</p>
            )}
        </div>
    );
}
