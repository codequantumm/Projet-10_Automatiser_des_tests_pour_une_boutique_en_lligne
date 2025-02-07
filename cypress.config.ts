import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,  
    html: true,
    json: true,
  },
  env: {
    apiUrl: 'http://localhost:8081',
    CYPRESS_USERNAME: 'test2@test.fr',
    CYPRESS_PASSWORD: 'testtest',
  },
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    screenshotOnRunFailure: true,
  },
});
