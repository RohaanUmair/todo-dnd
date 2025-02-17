/// <reference types="cypress" />

import '@4tw/cypress-drag-drop'


Cypress.Commands.add("dragTo", { prevSubject: "element" }, (subject, targetEl) => {
    const dataTransfer = new DataTransfer();
    cy.get(subject).trigger('dragstart', {
        dataTransfer
    });
    cy.get(targetEl).trigger('drop', {
        dataTransfer
    })
}
);

Cypress.Commands.add('dragAndDropDndKit', (dragSelector, dropSelector) => {
    cy.get(dragSelector)
        .trigger('pointerdown', { buttons: 1 }) // Simulate mouse click
        .trigger('pointermove', { clientX: 200, clientY: 200 }) // Move to the target area
        .wait(100) // Small delay for stability
        .get(dropSelector)
        .trigger('pointerup', { force: true }); // Drop the item
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