export const mockUsers = [
    {
        id: "user123",
        name: "Test User",
        email: "user@example.com",
        role: "USER",
    },
    {
        id: "driver123",
        name: "Test Driver",
        email: "driver@example.com",
        role: "DRIVER",
    },
];

export const fakeLoginData = (role: "USER" | "DRIVER") => {
    return mockUsers.find((user) => user.role === role);
};
