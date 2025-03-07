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
      <h1 className="mb-6 text-3xl font-bold">Messages</h1>
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded border border-gray-300 bg-white p-4 shadow-md"
            >
              <h2 className="text-lg font-semibold">{msg.sender}</h2>
              <p>{msg.message}</p>
              <button className="mt-2 rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600">
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
