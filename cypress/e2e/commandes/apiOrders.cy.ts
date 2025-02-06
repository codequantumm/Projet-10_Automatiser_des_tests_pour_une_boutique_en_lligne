import { apiOrders } from '../../support/commands';

describe('GET /orders - Non authentifié, accès refusé', () => {
  it('Doit retourner une erreur 401 pour une requête non authentifiée', () => {
    cy.verifierPanier(apiOrders, 401);
  });
});

describe('GET /orders - Authentifié', () => {
  it('Requête authentifiée sur /orders retourne la liste des produits', () => {
    cy.login().then(() => {
      cy.verifierPanier(apiOrders, 200);
    });
  });
});
