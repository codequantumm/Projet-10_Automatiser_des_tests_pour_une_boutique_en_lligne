describe('GET /products - Liste des produits', () => {
  it('Devrait retourner un tableau de produits avec les propriétés attendues', () => {
    cy.verifierListeProduits();
  });
});

describe('GET /products/:id - Fiche produit spécifique', () => {
  it('Devrait retourner la fiche produit pour un ID valide', () => {
    const productId = 3;
    cy.request(`http://localhost:8081/products/${productId}`).then(
      (response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', productId);
        expect(response.body).to.have.property('name').that.is.a('string');
        expect(response.body)
          .to.have.property('description')
          .that.is.a('string');
      }
    );
  });
});
