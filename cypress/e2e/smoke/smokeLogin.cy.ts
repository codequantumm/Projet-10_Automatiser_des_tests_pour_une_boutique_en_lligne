describe('Smoke Test - Page de connexion', () => {
    it('Vérifie la présence des champs et du bouton de connexion', () => {
      
      cy.visit('http://localhost:8080/#/');
      cy.get('[data-cy="nav-link-register"]').should('be.visible');
      cy.get('[data-cy="nav-link-login"]').should('be.visible').click();
      cy.get("[data-cy='login-input-username']").should('exist');
      cy.get("[data-cy='login-input-password']").should('exist');
      cy.get("[data-cy='login-submit']").should('exist').contains('Se connecter');
    });
  });
  