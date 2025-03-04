"use client";

import { useState } from "react";

import { paymentApi } from "@/utils/api";

const CheckoutPage = () => {
  const [amount, setAmount] = useState<number>(0);
  const handlePayment = async () => {
    try {
      await paymentApi.initiatePayment({ amount, serviceId: "trip123" });
      alert("Payment successful!");
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded bg-white p-8 shadow">
      <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="mb-4 w-full rounded border p-2"
      />
      <button
        onClick={handlePayment}
        className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
      >
        Pay Now
      </button>
    </div>
  );
};

export default CheckoutPage;
