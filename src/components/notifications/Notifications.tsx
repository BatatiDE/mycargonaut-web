"use client";

import React from "react";

const Notifications = ({ messages }: { messages: string[] }) => {
    return (
        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500">
            {messages.map((msg, index) => (
                <p key={index} className="text-yellow-800">
                    {msg}
                </p>
            ))}
        </div>
    );
};

export default Notifications;
