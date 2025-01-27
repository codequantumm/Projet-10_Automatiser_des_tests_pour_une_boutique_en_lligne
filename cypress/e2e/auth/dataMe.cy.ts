describe('GET /me - Infos utilisateurs avant connexion', () => {
  it('Doit retourner 401', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/me`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});
