'use client';

import { useState } from 'react';
import { authApi } from '@/utils/api';
import { getErrorMessage } from '@/utils/errorHandler';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter(); // Used for navigation
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Validate user age
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age -= 1;
        }

        if (age < 18) {
            setError('You must be at least 18 years old to register.');
            return;
        }

        try {
            const response = await authApi.register({
                email,
                password,
            });

            setMessage('Registration successful!');
            console.log('Register response:', response);

            // Redirect to login page after successful registration
            setTimeout(() => {
                router.push('/login'); // Redirect to the login page
            }, 2000); // Wait for 2 seconds to show the success message
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            console.error('Register error:', errorMessage);
            setError(errorMessage || 'Registration failed.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {message && <p className="text-green-500 text-center">{message}</p>}
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="birthdate">
                            Birthdate
                        </label>
                        <input
                            type="date"
                            id="birthdate"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none disabled:bg-gray-300"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center mt-4 text-sm">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}
