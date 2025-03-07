// components/LocationAutocomplete.tsx
import React, {useState} from "react";

interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (lat: number, lon: number) => void; // Neu: Für Koordinatenübergabe
    placeholder?: string;
}

interface Suggestion {
    display_name: string;
    lat: string;
    lon: string;
}

const DEBOUNCE_DELAY = 300;

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
                                                                       value,
                                                                       onChange,
                                                                       onSelect,
                                                                       placeholder = "Enter location...",
                                                                   }) => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null); // Debounce Timer hinzufügen

    /*
    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        onChange(query);

        if (query.length > 2) {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
                );

                if (response.ok) {
                    const data: Suggestion[] = await response.json();
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
    */

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        onChange(query);

        if (debounceTimer) clearTimeout(debounceTimer); // Vorherigen Timer abbrechen

        if (query.length > 2) {
            setIsLoading(true);
            const newTimer = setTimeout(async () => {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
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
            }, DEBOUNCE_DELAY);

            setDebounceTimer(newTimer); // Speichere den neuen Timer
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        onChange(suggestion.display_name);
        onSelect(parseFloat(suggestion.lat), parseFloat(suggestion.lon)); // Koordinaten setzen
        setSuggestions([]); // Dropdown schließen
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full rounded border p-2"
            />
            {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
            {suggestions.length > 0 && (
                <ul className="absolute z-10 max-h-40 w-full overflow-y-auto rounded border bg-white shadow">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="cursor-pointer p-2 hover:bg-gray-100"
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
