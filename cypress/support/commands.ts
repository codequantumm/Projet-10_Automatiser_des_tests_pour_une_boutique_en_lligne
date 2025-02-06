import { OrderLines, Product } from "cypress/e2e/types/inerfaceProduit";
export const apiOrders = `${Cypress.env('apiUrl')}/orders`;

Cypress.Commands.add('login', () => {
  const loginData = {
    username: Cypress.env('CYPRESS_USERNAME'),
    password: Cypress.env('CYPRESS_PASSWORD'),
  };
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/login`,
    body: loginData,
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
    Cypress.env('authToken', response.body.token);
  });
});

Cypress.Commands.add('loginInvalid', (username: string, password: string) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/login`,
    failOnStatusCode: false,
    body: { username, password },
  }).then((response) => {
    expect(response.status).to.eq(401);
    cy.log('Réponse pour utilisateur invalide:', JSON.stringify(response.body));
  });
});

Cypress.Commands.add('verifierPanier', (url: string, expectedStatus: number) => {
  cy.request({
    method: 'GET',
    url: url,
    failOnStatusCode: false,
    headers: { Authorization: `Bearer ${Cypress.env('authToken')}` },
  }).then((response) => {
    expect(response.status).to.eq(expectedStatus);

    expect(response.body).to.have.property('id').that.is.a('number');
    expect(response.body).to.have.property('orderLines').that.is.an('array');

    response.body.orderLines.forEach((line: OrderLines) => {
      expect(line).to.have.property('id').that.is.a('number');
      expect(line).to.have.property('product').that.is.an('object');
      expect(line.product).to.have.property('id').that.is.a('number');
      expect(line.product).to.have.property('name').that.is.a('string');
      expect(line.product).to.have.property('description').that.is.a('string');
      expect(line.product).to.have.property('price').that.is.a('number');
      expect(line.product).to.have.property('picture').that.is.a('string');
      expect(line).to.have.property('quantity').that.is.a('number');

      return response; 
    });
  });
});


Cypress.Commands.add('verifierListeProduits', () => {
  cy.login().then(() => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/products`,
      headers: {
        Authorization: `Bearer ${Cypress.env('authToken')}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');

      response.body.forEach((product: Product) => {
        expect(product).to.have.property('id').that.is.a('number');
        expect(product).to.have.property('name').that.is.a('string');
        expect(product).to.have.property('availableStock').that.is.a('number');
        expect(product).to.have.property('skin').that.is.a('string');
        expect(product).to.have.property('aromas').that.is.a('string');
        expect(product).to.have.property('ingredients').that.is.a('string');
        expect(product).to.have.property('description').that.is.a('string');
        expect(product).to.have.property('price').that.is.a('number');
        expect(product).to.have.property('picture').that.is.a('string');
        expect(product).to.have.property('varieties').that.is.a('number');
      });
    });
  });
});

Cypress.Commands.add('viderPanier', () => {
  cy.login().then(() => {
    return cy.verifierPanier(apiOrders, 200);
  }).then((response) => {
    const orderLines = response.body.orderLines;
    if (orderLines && orderLines.length > 0) {
      orderLines.forEach((line: OrderLines) => {
        return cy.request({
          method: 'DELETE',
          url: `http://localhost:8081/orders/${line.id}/delete`,
          failOnStatusCode: false,
          headers: {
            Authorization: `Bearer ${Cypress.env('authToken')}`,
          },
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);
        });
      });
    }
  });
});

Cypress.Commands.add('ajouterProduitAuPanierApI', (product: number, quantity: number) => {
  cy.viderPanier(); 
  cy.login().then(() => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/orders/add',
      headers: {
        Authorization: `Bearer ${Cypress.env('authToken')}`,
      },
      body: {
        product: product,
        quantity: quantity,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      const addedProduct = response.body.orderLines[0].product;
      expect(addedProduct.id).to.eq(product);
    });
  });
});

Cypress.Commands.add('ajouterProduitAuPanierRuptureStock', (product: number, quantity: number) => {
  cy.viderPanier();
  cy.login().then(() => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/orders/add',
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${Cypress.env('authToken')}`,
      },
      body: {
        product: product,
        quantity: quantity,
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});

Cypress.Commands.add('ajouterAvisMalveillant', () => {
  cy.login().then(() => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/reviews`,
      failOnStatusCode: false,
      headers: {
        Authorization: `Bearer ${Cypress.env('authToken')}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});

Cypress.Commands.add('ajouterAvis', (avis: { title: string; comment: string; rating: number }) => {
  cy.login().then(() => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      headers: {
        Authorization: `Bearer ${Cypress.env('authToken')}`,
      },
      body: avis,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id');
      expect(response.body.title).to.eq(avis.title);
      expect(response.body.comment).to.eq(avis.comment);
      expect(response.body.rating).to.eq(avis.rating);

      expect(response.body.author).to.have.property('email', 'test2@test.fr');
      expect(response.body.author).to.have.property(
        'username',
        'test2@test.fr'
      );
    });
  });
});

Cypress.Commands.add('posterAvisNonConnecte', (avis: { title: string; comment: string; rating: number }) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/reviews`,
    body: avis,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('connexion', () => {
  const username = Cypress.env('CYPRESS_USERNAME');
  const password = Cypress.env('CYPRESS_PASSWORD');
  cy.wrap(username).should('exist');
  cy.wrap(password).should('exist');
  cy.visit('/#/login');
  cy.get('[data-cy="login-input-username"]').type(username);
  cy.get('[data-cy="login-input-password"]').type(password);
  cy.get('[data-cy="login-submit"]').click();
});


Cypress.Commands.add('ajouterProduitAuPanier', () => {
  cy.get('[data-cy="detail-product-add"]').click();
      cy.wait(2000);

      // Étape 4 : Vérifier que le produit est bien ajouté au panier
      cy.get('[data-cy="nav-link-cart"]').click();
      cy.get('[data-cy="cart-line-quantity"]')
        .should('exist')
        .should('have.value', '1');
  });


Cypress.Commands.add('verifierProduitDansPanier', (productId, expectedQuantity) => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:8081/orders',
    headers: { Authorization: `Bearer ${Cypress.env('authToken')}` },
  }).then((response) => {
    expect(response.status).to.eq(200);
    const productInCart = response.body.find((p: { id: number; }) => p.id === productId);
    cy.wrap(productInCart).should('exist');
    expect(productInCart.quantity).to.eq(expectedQuantity);

    cy.log(`✅ Produit ${productId} présent dans le panier avec quantité: ${expectedQuantity}`);
  });
});

Cypress.Commands.add('verifierStockMaJ', (productId) => {
  cy.get('@initialStock').then(($initialStock) => { 
    const initialStock = Number($initialStock); 

    cy.request('GET', `http://localhost:8081/products/${productId}`).then((updatedResponse) => {
      expect(updatedResponse.status).to.eq(200);

      cy.log("Réponse API produit mis à jour:", JSON.stringify(updatedResponse.body));

      const updatedStock: number = updatedResponse.body.availableStock;

      expect(updatedStock, "Stock mis à jour non défini").to.be.a('number');
      expect(updatedStock).to.equal(initialStock - 1); 

      cy.log(`📉 Nouveau stock pour le produit ${productId}: ${updatedStock}`);

      cy.visit(`/#/products/${productId}`);
      cy.get('[data-cy="detail-product-stock"]')
        .should('exist')
        .should('be.visible')
        .and('contain', updatedStock);
    });
  });
});


Cypress.Commands.add('verifierStockProduit', (productId, initialStock) => {
  cy.visit(`/#/products/${productId}`);
      cy.get('[data-cy="detail-product-stock"]')
        .should('exist')
        .should('be.visible')
        .and('contain', initialStock);
}); 

Cypress.Commands.add('verifierStockInitialNegatif', (productId: number) => {
  cy.request(`GET`, `http://localhost:8081/products/${productId}`).then((response) => {
    expect(response.status).to.eq(200);

    cy.log("Réponse API produit:", JSON.stringify(response.body));

    const initialStock = response.body.availableStock;

    expect(initialStock, "Stock initial incorrect").to.be.a('number');
    expect(initialStock).to.be.lessThan(0);

    cy.log(`🚨 Stock initial négatif pour le produit ${productId}: ${initialStock}`);
    cy.wrap(initialStock).as('initialStock');
  });
});


Cypress.Commands.add('verifierStockInitial', (productId) => {
  cy.request(`GET`, `http://localhost:8081/products/${productId}`).then((response) => {
    expect(response.status).to.eq(200);

    cy.log("Réponse API produit:", JSON.stringify(response.body));

    const initialStock = response.body.availableStock;

    expect(initialStock, "Stock initial non défini").to.be.a('number');
    expect(initialStock).to.be.greaterThan(0);

    cy.log(`✅ Stock initial pour le produit ${productId}: ${initialStock}`);
    cy.wrap(initialStock).as('initialStock');
  });
}); 