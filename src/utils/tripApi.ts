const TRIP_GRAPHQL_ENDPOINT = "http://localhost:8080/graphql"; // Ensure correct backend URL

// Generic GraphQL Fetch Helper for Trips
async function graphQLFetch(query: string) {
    const token = localStorage.getItem("authToken");

    const response = await fetch(TRIP_GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    if (result.errors) {
        throw new Error(result.errors[0]?.message || "GraphQL query failed.");
    }

    return result.data;
}

// Trip API Functions
export const tripApi = {
    getTrips: async () => {
        const query = `
            query {
                getTrips {
                    id
                    startPoint
                    destinationPoint
                    date
                    time
                    availableSpace
                    total_capacity
                    driverId  
                    status
                    bookedUsers {
                      id
                      userId
                      status
                      createdAt
                }

                }
            }
        `;
        const data = await graphQLFetch(query);
        return data.getTrips;
    },

    // Additional functions (e.g., addTrip, bookTrip) can be added here
    addTrip: async (input: {
        driverId: number;
        startPoint: string;
        destinationPoint: string;
        date: string;
        time: string;
        availableSpace: number;
    }) => {
        const query = `
            mutation {
                addTrip(input: {
                    driverId: ${input.driverId},
                    startPoint: "${input.startPoint}",
                    destinationPoint: "${input.destinationPoint}",
                    date: "${input.date}",
                    time: "${input.time}",
                    availableSpace: ${input.availableSpace}
                }) {
                    id
                    startPoint
                    destinationPoint
                    date
                    time
                    availableSpace
                }
            }
        `;
        const data = await graphQLFetch(query);
        return data.addTrip;
    },

    updateUserRole: async (userId: number, role: string) => {
        const query = `
        mutation {
            updateUserRole(userId: ${userId}, role: "${role}") {
                id
                email
                role
                name
            }
        }
    `;
        return await graphQLFetch(query);
    },
    // Bookings
    bookTrip: async (tripId: string) => {
        const mutation = `
        mutation {
            bookTrip(tripId: "${tripId}") {
                success
                message
                booking {
                    id
                    status
                }
            }
        }
    `;

        const data = await graphQLFetch(mutation);
        return data.bookTrip;
    },


    // Confirmation
    confirmBooking: async (bookingId: string) => {
        const mutation = `
        mutation {
            confirmBooking(bookingId: "${bookingId}") {
                success
                message
                booking {
                    id
                    status
                }
            }
        }
    `;
        const data = await graphQLFetch(mutation);
        return data.confirmBooking;
    },


    cancelBooking: async (bookingId: string) => {
        const query = `
        mutation CancelBooking($bookingId: ID!) {
            cancelBooking(bookingId: $bookingId) {
                success
                message
            }
        }
    `;
        const variables = { bookingId };
        const data = await graphQLFetch(query, variables);
        return data.cancelBooking;
    },


};
