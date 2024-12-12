const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000', // Adjust this URL if your frontend runs on a different port
        supportFile: false, // If you don't have a custom support file
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Path to your test files
    },
})
