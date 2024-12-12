'use client';

import React, { useState } from 'react';
import { createOffer } from '@/utils/api';

export default function OfferPage() {
    const [start, setStart] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [payloadDetails, setPayloadDetails] = useState('');
    const [price, setPrice] = useState('');
    const [notes, setNotes] = useState(''); // New state for notes
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await createOffer({
                start,
                destination,
                date,
                payloadDetails,
                price: parseFloat(price), // Convert price to a number
                notes, // Include notes in the payload
            });

            setMessage('Offer created successfully!');
            console.log('Offer response:', response);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                console.error('Error creating offer:', err.message);
            } else {
                setError('Unexpected error occurred.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Create an Offer</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {message && <p className="text-green-500 text-center">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="start" className="block text-sm font-medium text-gray-700">
                            Start Location
                        </label>
                        <input
                            type="text"
                            id="start"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                            Destination
                        </label>
                        <input
                            type="text"
                            id="destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="payloadDetails" className="block text-sm font-medium text-gray-700">
                            Payload Details
                        </label>
                        <input
                            type="text"
                            id="payloadDetails"
                            value={payloadDetails}
                            onChange={(e) => setPayloadDetails(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Price (€)
                        </label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Notes (Optional)
                        </label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Any additional information about your offer"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
                    >
                        Create Offer
                    </button>
                </form>
            </div>
        </div>
    );
}
