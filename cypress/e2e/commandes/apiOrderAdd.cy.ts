describe('Ajout au panier', () => {
  it('Ajoute un produit disponible', () => {
    cy.ajouterProduitAuPanier(7, 3);
  });

  it('Échec lors de l’ajout d’un produit en rupture de stock', () => {
    cy.ajouterProduitAuPanierRuptureStock(4, 2);
  });
});
