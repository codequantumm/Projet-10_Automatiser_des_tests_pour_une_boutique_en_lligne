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

Cypress.Commands.add('verifierStatusRequete', (url: string, expectedStatus: number) => {
  cy.request({
    method: 'GET',
    url: apiOrders,
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(expectedStatus);
  });
});


Cypress.Commands.add('verifierCommande', () => {
  cy.request({
    method: 'GET',
    url: apiOrders,
    headers: { Authorization: `Bearer ${Cypress.env('authToken')}` },
  }).then((response) => {
    expect(response.status).to.eq(200);
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
    cy.verifierCommande(apiOrders, 200);
  }).then((response) => {
    const orderLines = response.body.orderLines;
    if (orderLines && orderLines.length > 0) {
      orderLines.forEach((line: OrderLines) => {
        return cy.request({
          method: 'DELETE',
          url: `http://localhost:8081/orders/${line.id}/delete`,
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

Cypress.Commands.add('ajouterProduitAuPanier', (product: number, quantity: number) => {
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
      expect(response.body.orderLines[0].product.name).to.eq(
        'Extrait de nature'
      );
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
