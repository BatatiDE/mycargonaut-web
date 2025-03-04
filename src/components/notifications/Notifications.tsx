"use client";

import React from "react";

const Notifications = ({ messages }: { messages: string[] }) => {
  return (
    <div className="border-l-4 border-yellow-500 bg-yellow-100 p-4">
      {messages.map((msg, index) => (
        <p key={index} className="text-yellow-800">
          {msg}
        </p>
      ))}
    </div>
  );
};

export default Notifications;
