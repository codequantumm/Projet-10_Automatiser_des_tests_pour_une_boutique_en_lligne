describe('Smoke Test - Disponibilité des produits', () => {
    before(() => {
      cy.login(); 
    });
  
    it('Vérifie la disponibilité du produit', () => {
      cy.visit('http://localhost:8080/#/products/3'); 
      cy.get("[data-cy='detail-product-stock']").should('be.visible');
      cy.get('[data-cy="detail-product-price"]').should('be.visible');
    cy.get('[data-cy="detail-product-quantity"]').should('be.visible');
    cy.get('[data-cy="detail-product-add"]').should('be.visible').should('not.be.disabled');//anomaly - it should be disable 
    });
  });
  