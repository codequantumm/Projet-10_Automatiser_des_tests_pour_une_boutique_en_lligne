import { apiOrders } from "cypress/support/commands";
import { Product } from "../types/inerfaceProduit";

describe("Panier - Test dynamique pour chaque produit", () => {
  beforeEach(() => {
    cy.connexion();
    cy.viderPanier();
  });

  it("Ajoute un produit au panier et vérifie la mise à jour du stock", () => {
    const productId = 10;

    cy.verifierStockInitial(productId);
    cy.get('@initialStock').then((initialStock) => {
      cy.log(`Le stock initial récupéré est : ${initialStock}`);
    
      cy.verifierStockProduit(productId, initialStock);

      cy.ajouterProduitAuPanier(productId);

      cy.verifierStockMaJ(productId);

      cy.verifierPanier(apiOrders, 200);
  
    });
  });

  it("Ne doit pas permettre l'ajout au panier d'un produit en stock négatif", () => {
    const productId = 3;
    
    cy.verifierStockInitialNegatif(productId);
    cy.get('@initialStock').then((initialStock) => {
      cy.log(`Stock initial récupéré : ${initialStock}`);
          
      cy.verifierStockProduit(productId, initialStock);

      cy.ajouterProduitAuPanier(productId);
      
      cy.verifierStockMaJ(productId);
      
      cy.verifierPanier(apiOrders, 404)
      
    
    });
  });
      
  
  it("Ne doit pas ajouter un produit avec une quantité négative (-1)", () => {
    cy.request<Product[]>("GET", "http://localhost:8081/products").then((response) => {
      response.body.forEach((product) => {
        cy.visit(`/#/products/${product.id}`);
        cy.get('[data-cy="detail-product-quantity"]').clear().type("-1");
        
        cy.get('[data-cy="detail-product-add"]').click();
        cy.location("href").should("not.eq", "http://localhost:8080/#/cart");
        
      });
    });
  });

  it("Ne doit pas ajouter un produit avec une quantité supérieure à 20 (21)", () => {
    cy.request<Product[]>("GET", "http://localhost:8081/products").then((response) => {
      response.body.forEach((product) => {
        cy.visit(`/#/products/${product.id}`);
        cy.get('[data-cy="detail-product-quantity"]').clear().type("21");
        cy.get('[data-cy="detail-product-add"]').should("be.disabled");
        cy.screenshot(`bouton_ajout_disabled_qte_21_produit_${product.id}`);
      });
    });

  });
}); 