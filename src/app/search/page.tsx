/*
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
*/

'use client'

import { useState } from 'react'
import Search from '@/components/Search'
import OfferList from '@/components/OfferList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trip } from "@/types/trip";

export default function SearchPage() {
    const [searchCriteria, setSearchCriteria] = useState({
        startingPoint: '',
        destinationPoint: '',
        date: undefined as Date | undefined,
        passengerSeats: 0,
        freightSpace: 0,
        isFreightOnly: false,
        /*filteredRides: [] as Trip []*/
    })
    const [activeTab, setActiveTab] = useState<'offers' | 'requests'>('offers')

    const handleSearch = (criteria: typeof searchCriteria) => {
        setSearchCriteria(criteria)
        // Here you would normally perform the search with the new criteria
        console.log('New search criteria:', criteria)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Fahrten finden</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Suchkriterien</h2>
                    <Search action={handleSearch} />
                </div>
                <div className="lg:col-span-2">
                    <Tabs defaultValue="offers" onValueChange={(value) => setActiveTab(value as 'offers' | 'requests')}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="offers">Verfügbare Fahrten</TabsTrigger>
                            <TabsTrigger value="requests">Fahrt- und Frachtgesuche</TabsTrigger>
                        </TabsList>
                        <TabsContent value="offers">
                            <OfferList type="offers" searchCriteria={searchCriteria} />
                        </TabsContent>
                        <TabsContent value="requests">
                            <OfferList type="requests" searchCriteria={searchCriteria} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

