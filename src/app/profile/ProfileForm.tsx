"use client";

import { useState, useEffect } from "react";
import { profileApi } from "@/utils/api"; // API functions
import { getErrorMessage } from "@/utils/errorHandler";
import {useAuth} from "@/utils/AuthContext";

export default function ProfileForm() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await profileApi.fetchProfile();
                setName(userData.name || "");
                setEmail(userData.email || "");
                setPhone(userData.phone || "");
                setError(null); // Clear errors if the request is successful
            } catch (err) {
                const errorMessage = getErrorMessage(err);
                console.error("Error fetching profile:", errorMessage);
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);
    const { refreshUser } = useAuth();

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            await profileApi.updateProfile({ name, phone });
            setSuccessMessage("Profile updated successfully.");

            // Refresh user data in AuthContext
            await refreshUser();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    if (isLoading) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {successMessage && (
                <p className="text-green-500 text-center mb-4">{successMessage}</p>
            )}
            <form className="space-y-4" onSubmit={handleSaveChanges}>
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="name"
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        readOnly // Email is not editable
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="phone"
                    >
                        Phone
                    </label>
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none disabled:bg-gray-300"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
