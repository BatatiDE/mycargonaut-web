"use client";

import { useState } from "react";

export default function PaymentsPage() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handlePayment = async () => {
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      console.log(data); // Log it temporarily to ensure it's being utilized

      setStatus("Payment successful!");
    } catch (error) {
      console.error("Error processing payment:", error);
      setStatus("Payment failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold">Payments</h1>
      <div className="rounded bg-white p-6 shadow-md">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="mb-4 w-full rounded border p-2"
        />
        <button
          onClick={handlePayment}
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          Pay
        </button>
        {status && <p className="mt-4">{status}</p>}
      </div>
    </div>
  );
}
