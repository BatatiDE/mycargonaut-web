'use client';

import React, { useState } from 'react';
import { getErrorMessage } from '@/utils/errorHandler'; // Ensure this path matches your project structure

export default function SearchPage() {
    const [results, setResults] = useState([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (query: string) => {
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            const data = await response.json();
            setResults(data);
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err);
            console.error('Search error:', errorMessage);
            setError(errorMessage);
        }
    };

    return (
        <div className="search-page">
            <h1>Search</h1>
            <input
                type="text"
                placeholder="Search..."
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch((e.target as HTMLInputElement).value);
                    }
                }}
            />
            {error && <p className="error-message">{error}</p>}
            <ul>
                {results.map((result, index) => (
                    <li key={index}>{result}</li>
                ))}
            </ul>
        </div>
    );
}
