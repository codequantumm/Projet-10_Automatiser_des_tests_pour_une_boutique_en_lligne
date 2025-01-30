describe('Test 2 - Connexion', () => {
    it('Connexion avec un utilisateur existant', () => {
      cy.connexion();
      cy.get('[data-cy="nav-link-cart"]').should('be.visible').should('contain', 'Mon panier');
    });
  });
  