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
        <div className="max-w-md mx-auto p-8 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <input
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2 border rounded mb-4"
            />
            <button
                onClick={handlePayment}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
                Pay Now
            </button>
        </div>
    );
};

export default CheckoutPage;
