import React from "react";

interface StarRatingProps {
    rating: number; // Average rating value
    maxStars?: number; // Maximum number of stars to display (default: 5)
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5 }) => {
    const fullStars = Math.floor(rating); // Full stars
    const halfStar = rating % 1 >= 0.5; // Check if half star is needed
    const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex">
            {/* Full Stars */}
            {Array.from({ length: fullStars }).map((_, index) => (
                <span key={`full-${index}`} className="text-yellow-500">★</span>
            ))}

            {/* Half Star */}
            {halfStar && <span className="text-yellow-500">★</span>}

            {/* Empty Stars */}
            {Array.from({ length: emptyStars }).map((_, index) => (
                <span key={`empty-${index}`} className="text-gray-300">★</span>
            ))}
        </div>
    );
};

export default StarRating;
