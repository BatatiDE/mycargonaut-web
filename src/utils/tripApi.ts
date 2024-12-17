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

};
