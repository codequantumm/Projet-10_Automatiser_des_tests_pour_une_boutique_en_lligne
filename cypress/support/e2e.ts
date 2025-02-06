import './commands';

afterEach(function () {
  if (this.currentTest && this.currentTest.state === "failed") {
    cy.screenshot(`echec_${this.currentTest.title}`);
  }
});