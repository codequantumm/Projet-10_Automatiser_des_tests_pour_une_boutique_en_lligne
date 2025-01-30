
    describe('Smoke Test - Boutons Ajouter au panier', () => {
        before(() => {
          cy.login(); 
        });
      
        it('Vérifie les boutons Ajouter au panier', () => {
          cy.visit('http://localhost:8080/#/products/3');
          cy.get("[data-cy='detail-product-add']").should('exist');
        });
      });
      
  