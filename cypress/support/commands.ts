/// <reference types="cypress" />

Cypress.Commands.add('login', (username, password) => {
    cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/login`, 
        body: { username, password },
    }).then((response) => {
        expect(response.status).to.eq(200);
        Cypress.env('authToken', response.body.token);
    });
});

Cypress.Commands.add('loginInvalid', (username, password) => {
    cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/login`,
        failOnStatusCode: false, 
        body: { username, password },
    }).then((response) => {
        expect(response.status).to.eq(401); 
        cy.log('Réponse pour utilisateur invalide:', JSON.stringify(response.body)); 
    });
});

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }