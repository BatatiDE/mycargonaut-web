'use client';

const DashboardPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow-md">
                    <h2 className="text-xl font-bold">Active Offers</h2>
                    <p className="text-gray-500">You have no active offers.</p>
                </div>
                <div className="bg-white p-4 rounded shadow-md">
                    <h2 className="text-xl font-bold">Active Requests</h2>
                    <p className="text-gray-500">You have no active requests.</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
