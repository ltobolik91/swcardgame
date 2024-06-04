/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    selectAndClick(selector: string): Chainable<any>;
  }
}

Cypress.Commands.add('selectAndClick', (selector: string) => {
  cy.get(selector).click();
});
