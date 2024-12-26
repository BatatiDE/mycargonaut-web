import React, { useState } from "react";

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState<number>(0);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (rating > 0 && rating <= 5) {
            onSubmit(rating);
            onClose();
        } else {
            alert("Please select a rating between 1 and 5.");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-lg font-bold mb-4">Leave a Review</h2>
                <p className="text-gray-600 mb-4">Rate your trip experience:</p>
                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            onClick={() => setRating(value)}
                            className={`w-10 h-10 rounded-full text-white ${
                                rating === value
                                    ? "bg-blue-500"
                                    : "bg-gray-300 hover:bg-blue-300"
                            }`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
