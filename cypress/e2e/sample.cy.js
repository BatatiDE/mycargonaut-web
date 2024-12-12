describe('Homepage', () => {
    it('should load the homepage successfully', () => {
        cy.visit('/')
        cy.contains('MyCargonaut Frontend is Ready! 🚀') // Adjust this text to match your homepage content
    })
})
