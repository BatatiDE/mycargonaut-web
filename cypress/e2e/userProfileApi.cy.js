describe("GET /api/users/me", () => {
  it("should fetch user profile successfully", () => {
    cy.request({
      method: "GET",
      url: "/api/users/me", // Relative URL
      headers: {
        Authorization: "Bearer YOUR_JWT_TOKEN",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id");
      expect(response.body).to.have.property("email");
      expect(response.body).to.have.property("name");
    });
  });
});
