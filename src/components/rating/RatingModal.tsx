import React, { useState } from "react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold">Leave a Review</h2>
        <p className="mb-4 text-gray-600">Rate your trip experience:</p>
        <div className="mb-6 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setRating(value)}
              className={`h-10 w-10 rounded-full text-white ${
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
            className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
