/// <reference types="cypress" />



declare namespace Cypress {
    interface Chainable {
      login(): Cypress.Chainable<void>;
      loginInvalid(email: string, password: string): Cypress.Chainable<void>;
      connexion(): Chainable<void>;
      viderPanier(): Chainable<Response>;
      ajouterProduitAuPanierApI(produit: number, quantity: number): Chainable<void>;
      ajouterProduitAuPanierRuptureStock(produit: number, quantity: number): Chainable<void>;
      verifierPanier(url: string, statusCode: number): Chainable<Response>;
      verifierListeProduits(): Chainable<void>;
      ajouterAvisMalveillant(avisXSS: { title: string; comment: string; rating: number }): Chainable<void>;
      posterAvisNonConnecte(avis: { title: string; comment: string; rating: number }): Chainable<Response>;
      ajouterAvis(avis: { title: string; comment: string; rating: number }): Chainable<void>;
      ajouterProduitAuPanier(productId): Chainable<void>;
      verifierStockMaJ(productId: number):Chainable<void>;
      verifierProduitDansPanier(productId, expectedQuantity): Chainable<void>;
      verifierStockProduit(productId, initialStock): Chainable<void>;
      verifierStockInitial(productId): Chainable<void>;
      verifierStockInitialNegatif(productId: number): Chainable<void>;
    }
  }



  