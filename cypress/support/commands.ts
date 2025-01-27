export const apiOrders = `${Cypress.env('apiUrl')}/orders`;

Cypress.Commands.add('login', () => {
  const loginData = {
    username: Cypress.env('CYPRESS_USERNAME'),
    password: Cypress.env('CYPRESS_PASSWORD'),
  };
  console.log(loginData);
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

Cypress.Commands.add('loginInvalid', (username, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/login`,
    failOnStatusCode: false,
    body: { username, password },
  }).then((response) => {
    console.log(response);
    expect(response.status).to.eq(401);
    cy.log('Réponse pour utilisateur invalide:', JSON.stringify(response.body));
  });
});

Cypress.Commands.add('verifierStatusRequete', (url, expectedStatus) => {
  cy.request({
    method: 'GET',
    url: apiOrders,
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(expectedStatus);
  });
});

Cypress.Commands.add('verifierCommande', (url, expectedStatus) => {
  cy.request({
    method: 'GET',
    url: apiOrders,
    headers: { Authorization: `Bearer ${Cypress.env('authToken')}` },
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('id').that.is.a('number');
    expect(response.body).to.have.property('orderLines').that.is.an('array');

    response.body.orderLines.forEach((line) => {
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
  cy.login().then((token) => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/products`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.be.an('array');

      response.body.forEach((product) => {
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
  cy.login()
    .then((token) => {
      cy.verifierCommande(apiOrders, 200);
    })
    .then((response) => {
      const orderLines = response.body.orderLines;
      if (orderLines && orderLines.length > 0) {
        orderLines.forEach((line) => {
          cy.request({
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


Cypress.Commands.add('ajouterProduitAuPanier', (product, quantity) => {
  cy.viderPanier(); // On commence par vider le panier
  cy.login().then((token) => {
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

Cypress.Commands.add('ajouterProduitAuPanierRuptureStock',(product, quantity) => {
    cy.viderPanier(); 
    cy.login().then((token) => {
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
  }
);

Cypress.Commands.add('ajouterAvisMalveillant', (avisXSS) => {
  cy.login().then((token) => {
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

Cypress.Commands.add('ajouterAvis', (avis) => {
  cy.login().then((token) => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      headers: {
        Authorization: `Bearer ${token}`,
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

Cypress.Commands.add('posterAvisNonConnecte', (avis) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/reviews`,
    body: avis,
    failOnStatusCode: false,
  });
});

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
