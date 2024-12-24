// components/LocationAutocomplete.tsx
import React, { useState } from "react";

interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}
interface Suggestion {
    display_name: string;
    lat: string;
    lon: string;
}
const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
                                                                       value,
                                                                       onChange,
                                                                       placeholder = "Enter location...",
                                                                   }) => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        onChange(query);

        if (query.length > 2) {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data);
                } else {
                    console.error("Failed to fetch location suggestions");
                }
            } catch (error) {
                console.error("Error fetching location suggestions:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        onChange(suggestion.display_name);
        setSuggestions([]);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full border p-2 rounded"
            />
            {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
            {suggestions.length > 0 && (
                <ul className="absolute bg-white border rounded shadow w-full max-h-40 overflow-y-auto z-10">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {suggestion.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationAutocomplete;
