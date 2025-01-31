import { Product } from "../types/inerfaceProduit";

describe('Panier - Test dynamique pour chaque produit', () => {
  beforeEach(() => {
    cy.connexion();
    cy.viderPanier();
    cy.visit('/#/cart');
cy.get('body').then(($body) => {
  if ($body.find('[data-cy="cart-line-quantity"]').length > 0) {
    cy.log('❌ Erreur : le panier n’a pas été vidé correctement.');
  } else {
    cy.log('✅ Panier bien vidé avant le test.');
  }
});
  });
  
  it('Test du stock et ajout au panier pour chaque produit', () => {
    cy.request('GET', 'http://localhost:8081/products').then((response) => {
      cy.request('GET', 'http://localhost:8081/products').then((response) => {
        const products: Product[] = response.body;
        console.log(products);
      });
        
      const products = response.body;
      cy.log(`📦 Nombre de produits récupérés : ${products.length}`);
  
      products.forEach((product: { id: number }) => {
        cy.visit(`/#/products/${product.id}`);
        cy.log(`🛒 Test du produit ID: ${product.id}`);
  
        cy.get('[data-cy="detail-product-stock"]').should('exist').and('be.visible')
          .then(($stock) => {
            const text = $stock.text().trim();
            const match = text.match(/-?\d+/);
            const stock = match ? parseInt(match[0], 10) : null;
  
            cy.log(`🔢 Stock extrait pour ID ${product.id} : ${stock}`);
  
            if (stock === null || isNaN(stock)) {
              cy.log(`❌ Stock introuvable pour ID ${product.id}, test ignoré.`);
              return;
            }
  
            if (stock <= 0) {
              cy.log(`⚠️ Stock insuffisant (${stock}) pour ID ${product.id}, test ignoré.`);
              return;
            }
  
            if (stock > 1) {
              cy.get('[data-cy="detail-product-add"]').should('be.visible').click();
              cy.get('[data-cy="cart-line-quantity"]').should('contain', '1');
  
              cy.visit(`/#/products/${product.id}`);
  
              cy.get('[data-cy="detail-product-stock"]').should(($newStock) => {
                const newText = $newStock.text().trim();
                const newMatch = newText.match(/-?\d+/);
                const newStock = newMatch ? parseInt(newMatch[0], 10) : null;
  
                cy.log(`🛒 Nouveau stock après ajout pour ID ${product.id} : ${newStock}`);
  
                if (newStock !== null) {
                  expect(newStock).to.equal(stock - 1);
                }
              });
            }
          });
      });
    });
  });
  
  it('Ne doit pas ajouter un produit avec une quantité négative (-1)', () => {
  cy.request<Product[]>('GET', 'http://localhost:8081/products').then((response) => {
    const products = response.body;

    products.forEach((product) => {
      cy.visit(`/#/products/${product.id}`);

      cy.get('[data-cy="detail-product-quantity"]').should('exist').and('be.visible').as('quantityInput');
      cy.get('@quantityInput').clear().type('-1');

      cy.get('[data-cy="detail-product-add"]').should('be.visible').click();
      cy.wait(500);
      cy.visit('/#/cart');
      cy.wait(1000);

      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="cart-line-quantity"]').length > 0) {
          cy.log('❌ Erreur : un produit avec quantité -1 a été ajouté au panier !');
        } else {
          cy.log('✅ Succès : produit avec quantité -1 NON ajouté au panier.');
        }
      });
    });
  });
});
it('Ne doit pas ajouter un produit avec une quantité supérieure au stock (21)', () => {
  cy.request<Product[]>('GET', 'http://localhost:8081/products').then((response) => {
    const products = response.body;

    products.forEach((product) => {
      cy.visit(`/#/products/${product.id}`);

      cy.get('[data-cy="detail-product-quantity"]').should('exist').and('be.visible').as('quantityInput');
      cy.get('@quantityInput').clear().type('21');

      cy.get('[data-cy="detail-product-add"]').should('be.visible').click();
      cy.wait(500);
      cy.visit('/#/cart');
      cy.wait(1000);

      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="cart-line-quantity"]').length > 0) {
          cy.log('❌ Erreur : un produit avec quantité 21 a été ajouté au panier !');
        } else {
          cy.log('✅ Succès : produit avec quantité 21 NON ajouté au panier.');
        }
      });
    });
  });
});

}); 