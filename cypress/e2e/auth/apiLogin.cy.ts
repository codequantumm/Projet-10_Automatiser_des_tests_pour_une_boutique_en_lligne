/// <reference types="cypress" />

describe('POST /login - Authentification réussie', () => {
  const apiLogin: string = `${Cypress.env('apiUrl')}/login`;

  it('Effectue une requête POST sur /login et valide la réponse 200 avec un token', () => {
    cy.login().then(() => {
      const token: string | undefined = Cypress.env('authToken');
      expect(token).to.exist;
    });
  });
});

describe('POST /login - Authentification échouée', () => {
  it('Retourne 401 pour des identifiants invalides', () => {
    cy.loginInvalid('wrong@example.com', 'wrongpass');
  });
});

