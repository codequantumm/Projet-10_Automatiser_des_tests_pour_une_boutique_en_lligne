// Test d'intégration pour l'API POST /login
describe('POST /login', () => {
  const apiLogin = `${Cypress.env('apiUrl')}/login`;

  it('Effectue une requête POST sur /login et valide la réponse 200 avec un token', () => {
    
    cy.login('test2@test.fr', 'testtest').then(() => {
      const token = Cypress.env('authToken'); 
      expect(token).to.exist;
    });
  });

  it('Retourne 401 pour un utilisateur inconnu', () => {
    cy.loginInvalid('wrong@example.com', 'wrongpass');
  });
});
