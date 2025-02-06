describe('POST Review - Ajouter un avis', () => {
  it('devrait créer un avis avec succès', () => {
   
      cy.ajouterAvis({
        title: 'Excellent produit !',
        comment: "J'adore ce produit, je le recommande.",
        rating: 5,
      });
    });
  

  it('devrait retourner une erreur 401 si un utilisateur non connecté tente de poster un avis', () => {
    const avis = { title: 'string', comment: 'string', rating: 5 };

    cy.posterAvisNonConnecte(avis).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it('Échec lors de l’ajout d’un avis avec injection XSS', () => {
    cy.ajouterAvisMalveillant({
      title: '<script>alert("XSS")</script>',
      comment: '<img src="x" onerror="alert(\'XSS\')">',
      rating: 3,
    });
  });
});
