import { Trip } from "@/types/trip";

const TRIP_GRAPHQL_ENDPOINT = "http://localhost:8080/graphql"; // Ensure correct backend URL

// Generic GraphQL Fetch Helper for Trips
async function graphQLFetch(query: string, variables?: Record<string, any>) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("No auth token found in localStorage");
    throw new Error("Please Login");
  }

  console.log("Sending request with auth token:", token);

  const response = await fetch(TRIP_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
        `GraphQL request failed: ${response.status} ${response.statusText}`,
        errorBody
    );
    throw new Error(`Error: ${response.status}`);
  }

  const result = await response.json();
  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error(result.errors[0]?.message || "GraphQL query failed.");
  }

  return result.data;
}

export const tripApi = {
  getTrips: async (): Promise<Trip[]> => {
    const query = `
      query {
        getTrips {
          id
          startingPoint
          destinationPoint
          date
          time
          availableSeats
          freightSpace
          price
          driverId  
          status
          notes
          type
          passengers: bookedUsers {
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

  addTrip: async (input: {
    driverId: number;
    startingPoint: string;
    destinationPoint: string;
    date: string;
    time: string;
    price: number;
    availableSeats?: number;
    freightSpace?: number;
    isFreightRide: boolean;
    vehicle?: string;
    notes?: string;
    type: "OFFER" | "REQUEST";
  }) => {
    const query = `
      mutation AddTrip($input: AddTripInput!) {
        addTrip(input: $input) {
          id
          startingPoint
          destinationPoint
          date
          time
          price
          availableSeats
          freightSpace
          isFreightRide
          vehicle
          notes
          type
        }
      }
    `;
    const variables = {
      input: {
        ...input,
        driverId: String(input.driverId),
        price: Number(input.price),
        availableSeats: Number(input.availableSeats),
        freightSpace: Number(input.freightSpace),
      },
    };

    try {
      console.log("Sending GraphQL variables:", JSON.stringify(variables, null, 2));
      const data = await graphQLFetch(query, variables);
      console.log("GraphQL response:", JSON.stringify(data, null, 2));
      return data.addTrip;
    } catch (error) {
      console.error("Error in addTrip:", error);
      throw error;
    }
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

  startOngoingTrip: async (tripId: string) => {
    const mutation = `
      mutation {
        startOngoing(tripId: ${tripId}) {
          id
          status
        }
      }
    `;
    const data = await graphQLFetch(mutation);
    return data.startOngoing;
  },

  completeTrip: async (tripId: string) => {
    const mutation = `
      mutation {
        completeTrip(tripId: "${tripId}") {
          id
          status
        }
      }
    `;
    const data = await graphQLFetch(mutation);
    return data.completeTrip;
  },

  updateTripStatus: async (tripId: string, status: string): Promise<Trip> => {
    const mutation = `
      mutation UpdateTripStatus($tripId: ID!, $status: String!) {
        updateTripStatus(tripId: $tripId, status: $status) {
          id
          status
          startingPoint
          destinationPoint
          date
          time
          availableSeats
          freightSpace
          price
          driverId
          notes
          type
          bookedUsers {
            id
            userId
            status
            createdAt
          }
        }
      }
    `;
    const variables = { tripId, status };
    const data = await graphQLFetch(mutation, variables);
    return data.updateTripStatus;
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
    const data = await graphQLFetch(query, { bookingId });
    return data.cancelBooking;
  },
};
