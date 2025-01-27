import { apiOrders } from '../../support/commands';

describe('GET /orders - Non authentifié, accès refusé', () => {
  it('Doit retourner une erreur 401 pour une requête non authentifiée', () => {
    cy.verifierStatusRequete(apiOrders, 401);
  });
});

describe('GET /orders - Authentifié', () => {
  it('Requête authentifiée sur /orders retourne la liste des produits', () => {
    cy.login().then(() => {
      cy.verifierCommande(apiOrders, 200);
    });
  });
});
