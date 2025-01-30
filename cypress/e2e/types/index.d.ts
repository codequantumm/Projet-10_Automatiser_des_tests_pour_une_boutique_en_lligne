/// <reference types="cypress" />



declare namespace Cypress {
    interface Chainable {
      login(): Cypress.Chainable<void>;
      loginInvalid(email: string, password: string): Cypress.Chainable<void>;
      connexion(): Chainable<void>;
      viderPanier(): Chainable<void>;
      ajouterProduitAuPanier(produit: number, quantity: number): Chainable<void>;
      ajouterProduitAuPanierRuptureStock(produit: number, quantity: number): Chainable<void>;
      verifierCommande(url: string, statusCode: number): Chainable<void>;
      verifierStatusRequete(url: string, statusCode: number): Chainable<void>;
      verifierListeProduits(): Chainable<void>;
      ajouterAvisMalveillant(avisXSS: { title: string; comment: string; rating: number }): Chainable<void>;
      posterAvisNonConnecte(avis: { title: string; comment: string; rating: number }): Chainable<Response>;
      ajouterAvis(avis: { title: string; comment: string; rating: number }): Chainable<void>; 
    }
  }



  