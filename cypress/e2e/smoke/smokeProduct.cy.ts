import { Product } from "../types/inerfaceProduit";

describe('Smoke Test - Disponibilité des produits', () => {
  before(() => {
    cy.login();
    cy.viderPanier(); 
  });
  
  it('Vérifie la disponibilité du produit', () => {
    cy.request<Product[]>('GET', 'http://localhost:8081/products').then((response) => {
      const products = response.body;
      
      products.forEach((product) => {
        cy.visit(`/#/products/${product.id}`);
        cy.get("[data-cy='detail-product-stock']").should('be.visible');
        cy.get('[data-cy="detail-product-price"]').should('be.visible');
        cy.get('[data-cy="detail-product-quantity"]').should('be.visible');
        
        cy.get('[data-cy="detail-product-add"]').should('be.visible').should('not.be.disabled');
      });
    });
  });

}); 